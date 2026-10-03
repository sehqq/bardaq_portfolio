import { useEffect } from 'react';
import { animate, motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(1);
  const smoothX = useSpring(mouseX, { damping: 32, stiffness: 420, mass: 0.35 });
  const smoothY = useSpring(mouseY, { damping: 32, stiffness: 420, mass: 0.35 });

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let tracking = false;
    let interactive = false;
    let fading = true;

    const hide = () => {
      clearTimeout(idleTimer);
      opacity.stop();
      opacity.set(0);
      tracking = false;
      fading = true;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      if (!tracking) {
        smoothX.jump(event.clientX);
        smoothY.jump(event.clientY);
        tracking = true;
      }

      const target = event.target instanceof Element ? event.target : null;
      const nextInteractive = !!target?.closest('a, button, [role="button"], .cursor-pointer');
      if (fading || interactive !== nextInteractive) {
        animate(opacity, nextInteractive ? 0.85 : 0.6, { duration: 0.16 });
        animate(scale, nextInteractive ? 1.16 : 1, { duration: 0.2 });
      }
      interactive = nextInteractive;
      fading = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        fading = true;
        animate(opacity, 0, { duration: 0.45, ease: 'easeOut' });
      }, 550);
    };

    const visibilityChanged = () => { if (document.hidden) hide(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', visibilityChanged);
    finePointer.addEventListener('change', hide);
    reducedMotion.addEventListener('change', hide);
    return () => {
      clearTimeout(idleTimer);
      opacity.stop();
      scale.stop();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', visibilityChanged);
      finePointer.removeEventListener('change', hide);
      reducedMotion.removeEventListener('change', hide);
    };
  }, [mouseX, mouseY, smoothX, smoothY, opacity, scale]);

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-glow"
      style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%', opacity, scale }}
    />
  );
};
