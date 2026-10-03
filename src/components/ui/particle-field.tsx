import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  depth: number;
  phase: number;
  radius: number;
}

// A restrained Canvas adaptation of the floating-particle direction from React Bits.
// https://www.reactbits.dev/backgrounds/particles
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const tokens = getComputedStyle(document.documentElement);
    const color = tokens.getPropertyValue('--color-particles').trim() || tokens.getPropertyValue('--color-text-primary').trim();
    const opacity = Number(tokens.getPropertyValue('--particles-opacity')) || 0.55;
    const speed = Number(tokens.getPropertyValue('--particles-speed')) || 1;
    const size = Number(tokens.getPropertyValue('--particles-size')) || 1.3;
    const maxBoost = Math.max(1, Math.min(2, Number(tokens.getPropertyValue('--particles-scroll-boost')) || 2));
    const returnDuration = Number(tokens.getPropertyValue('--particles-scroll-return')) || 0.3;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles: Particle[] = Array.from({ length: 96 }, () => ({
      x: Math.random(),
      y: Math.random(),
      depth: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      radius: 0.45 + Math.random() * 0.8,
    }));
    let width = 0;
    let height = 0;
    let count = 0;
    let frame = 0;
    let elapsed = 0;
    let driftElapsed = 0;
    let driftMultiplier = 1;
    let previousScrollY = window.scrollY;
    let scrollEnergy = 0;
    let last = 0;
    let lastPaint = 0;

    const paint = () => {
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < count; index++) {
        const particle = particles[index];
        const time = driftElapsed * speed;
        const x = particle.x * width + Math.sin(time * 0.07 + particle.phase) * 18 * particle.depth;
        const travel = particle.y * (height + 40) - time * 1.7 * particle.depth;
        const y = ((travel % (height + 40)) + height + 40) % (height + 40) - 20;
        const edgeFade = Math.max(0, Math.min(1, y / 35, (height - y) / 35));
        // Scroll affects movement only, preserving the original brightness rhythm.
        const pulse = 0.65 + 0.35 * Math.sin(elapsed * speed * 0.16 + particle.phase);
        const alpha = opacity * (0.3 + particle.depth * 0.7) * pulse * edgeFade;
        const radius = particle.radius * size;
        const glow = context.createRadialGradient(x, y, 0, x, y, radius * 3);
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'transparent');
        context.globalAlpha = alpha * 0.22;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, radius * 3, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      canvas.dataset.ready = 'true';
      canvas.dataset.driftMultiplier = driftMultiplier.toFixed(3);
    };

    const render = (now: number) => {
      const delta = last ? Math.min(now - last, 100) / 1000 : 0;
      if (delta > 0) {
        const scrollY = window.scrollY;
        const velocity = Math.abs(scrollY - previousScrollY) / delta;
        previousScrollY = scrollY;
        // A brief decay makes a single wheel tick feel as smooth as touch scrolling.
        scrollEnergy = Math.max(scrollEnergy * Math.exp(-delta / 0.18), Math.min(1, velocity / 1400));
        const target = 1 + scrollEnergy * (maxBoost - 1);
        const response = target > driftMultiplier ? 0.12 : returnDuration;
        driftMultiplier += (target - driftMultiplier) * (1 - Math.exp(-delta / response));
        elapsed += delta;
        driftElapsed += delta * driftMultiplier;
      }
      last = now;
      if (now - lastPaint >= 1000 / 30) {
        paint();
        lastPaint = now;
      }
      frame = requestAnimationFrame(render);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      previousScrollY = window.scrollY;
      scrollEnergy = 0;
      driftMultiplier = 1;
      if (document.hidden) return;
      paint();
      if (!reduced.matches) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      count = Math.max(24, Math.min(particles.length, Math.round(width * height / 21000)));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5, 1800 / width);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return <div className="particle-field" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
