import { useEffect, useRef } from 'react';

// Original contours with extended stems separated; small optical spacing corrections.
const glyphs = [
  { offset: 6, path: 'M686.249 408.063C699.499 408.063 710.812 403.375 720.187 394C729.562 384.625 734.249 373.313 734.249 360.063C734.249 346.813 729.562 335.5 720.187 326.125C710.812 316.75 699.499 312.063 686.249 312.063C672.999 312.063 661.687 316.75 652.312 326.125C642.937 335.5 638.249 346.813 638.249 360.063C638.249 373.313 642.937 384.625 652.312 394C661.687 403.375 672.999 408.063 686.249 408.063ZM622.312 455.969V296.032H638.249V317.688C639.124 316.688 640.062 315.719 641.062 314.781C653.562 302.282 668.624 296.032 686.249 296.032C703.937 296.032 719.03 302.282 731.53 314.781C744.03 327.281 750.28 342.375 750.28 360.063C750.28 377.688 744.03 392.75 731.53 405.25C719.03 417.75 703.937 424 686.249 424C668.624 424 653.562 417.75 641.062 405.25C640.062 404.313 639.124 403.344 638.249 402.344V455.969H622.312Z' },
  { offset: 5, path: 'M547.124 408.063C560.374 408.063 571.687 403.375 581.062 394C590.437 384.625 595.124 373.313 595.124 360.063C595.124 346.813 590.437 335.501 581.062 326.126C571.687 316.751 560.374 312.063 547.124 312.063C533.874 312.063 522.562 316.751 513.187 326.126C503.812 335.501 499.124 346.813 499.124 360.063C499.124 373.313 503.812 384.625 513.187 394C522.562 403.375 533.874 408.063 547.124 408.063ZM547.124 424C529.499 424 514.437 417.75 501.937 405.25C489.437 392.75 483.187 377.688 483.187 360.063C483.187 342.376 489.437 327.282 501.937 314.782C514.437 302.282 529.499 296.032 547.124 296.032C564.812 296.032 579.905 302.282 592.405 314.782C604.905 327.282 611.155 342.376 611.155 360.063C611.155 377.688 604.905 392.75 592.405 405.25C579.905 417.75 564.812 424 547.124 424Z' },
  { offset: 4, path: 'M452.624 424V312.063H436.687V296.032H484.687V312.063H468.656V424H452.624Z' },
  { offset: 3, path: 'M393.468 408.063C397.906 408.063 401.687 406.5 404.812 403.375C407.937 400.25 409.499 396.469 409.499 392.032C409.499 387.594 407.937 383.813 404.812 380.688C401.687 377.563 397.906 376 393.468 376C389.031 376 385.249 377.563 382.124 380.688C378.999 383.813 377.437 387.594 377.437 392.032C377.437 396.469 378.999 400.25 382.124 403.375C385.249 406.5 389.031 408.063 393.468 408.063ZM393.468 424C384.656 424 377.093 420.907 370.781 414.719C364.593 408.407 361.5 400.844 361.5 392.032C361.5 383.219 364.593 375.688 370.781 369.438C377.093 363.188 384.656 360.063 393.468 360.063C399.343 360.063 404.687 361.438 409.499 364.188V328.001C409.499 323.626 407.906 319.876 404.718 316.751C401.593 313.626 397.843 312.063 393.468 312.063C389.031 312.063 385.249 313.626 382.124 316.751C378.999 319.876 377.437 323.626 377.437 328.001H361.5C361.5 319.188 364.625 311.657 370.874 305.407C377.124 299.157 384.656 296.032 393.468 296.032C402.281 296.032 409.812 299.157 416.062 305.407C422.312 311.657 425.437 319.188 425.437 328.001V424H409.499V419.875C404.687 422.625 399.343 424 393.468 424Z' },
  { offset: 2, path: 'M335.625 344.032C333.375 337.407 329.562 331.438 324.187 326.126C314.812 316.751 303.5 312.063 290.25 312.063C277 312.063 265.687 316.751 256.312 326.126C251 331.438 247.187 337.407 244.875 344.032H335.625ZM290.25 424C272.625 424 257.562 417.75 245.062 405.25C232.562 392.75 226.312 377.688 226.312 360.063C226.312 342.376 232.562 327.282 245.062 314.782C257.562 302.282 272.625 296.032 290.25 296.032C307.937 296.032 323.031 302.282 335.531 314.782C348.031 327.282 354.281 342.376 354.281 360.063H242.25C242.25 373.313 246.937 384.625 256.312 394C265.687 403.375 277 408.063 290.25 408.063C296.812 408.063 303.062 406.813 309 404.313C314.75 401.875 319.812 398.438 324.187 394L335.531 405.25C329.656 411.188 322.875 415.782 315.187 419.032C307.25 422.344 298.937 424 290.25 424Z' },
  { offset: 1, path: 'M155.062 408.063C168.312 408.063 179.625 403.375 189 394C198.375 384.625 203.062 373.313 203.062 360.063C203.062 346.813 198.375 335.501 189 326.126C179.625 316.751 168.312 312.063 155.062 312.063C141.812 312.063 130.5 316.751 121.125 326.126C111.75 335.501 107.062 346.813 107.062 360.063C107.062 373.313 111.75 384.625 121.125 394C130.5 403.375 141.812 408.063 155.062 408.063ZM91.1249 455.969V296.032H107.062V317.688C107.937 316.688 108.875 315.719 109.875 314.782C122.375 302.282 137.437 296.032 155.062 296.032C172.75 296.032 187.843 302.282 200.343 314.782C212.843 327.282 219.093 342.376 219.093 360.063C219.093 377.688 212.843 392.75 200.343 405.25C187.843 417.75 172.75 424 155.062 424C137.437 424 122.375 417.75 109.875 405.25C108.875 404.313 107.937 403.344 107.062 402.344V455.969H91.1249Z' },
  { offset: 0, path: 'M0 424V240H15.9375V376C29.1875 376 40.4999 371.313 49.8749 361.938C59.2499 352.563 63.9374 341.251 63.9374 328.001V240H79.9686V328.001C79.9686 345.688 73.7187 360.782 61.2187 373.282C54.6562 379.844 47.4062 384.688 39.4687 387.813L79.9686 408.063V424L15.9375 392.032V424H0Z' },
 ];

interface StemSpring { value: number; velocity: number }

// Integrate at small fixed steps so the spring keeps the same character at
// different refresh rates and after a slow frame.
const advanceSpring = (spring: StemSpring, target: number, dt: number, stiffness: number, damping: number) => {
  const steps = Math.max(1, Math.ceil(dt * 120));
  const step = dt / steps;
  for (let i = 0; i < steps; i++) {
    spring.velocity += ((target - spring.value) * stiffness - spring.velocity * damping) * step;
    spring.value += spring.velocity * step;
  }
  if (Math.abs(target - spring.value) < 0.0005 && Math.abs(spring.velocity) < 0.001) {
    spring.value = target;
    spring.velocity = 0;
  }
};

export const HeroMark = ({ ready }: { ready: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    const section = svg?.closest('section');
    if (!svg || !section) return;
    const upperPath = svg.querySelector<SVGPathElement>('[data-stem="upper"]');
    const lowerPath = svg.querySelector<SVGPathElement>('[data-stem="lower"]');
    if (!upperPath || !lowerPath) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const tokens = getComputedStyle(svg);
    const bendLimit = parseFloat(tokens.getPropertyValue('--hero-stem-bend')) || 9;
    const clearance = parseFloat(tokens.getPropertyValue('--hero-stem-clearance')) || 64;
    const stagger = parseFloat(tokens.getPropertyValue('--hero-stem-stagger')) || 0.16;
    const stiffness = Number(tokens.getPropertyValue('--hero-stem-stiffness')) || 115;
    const damping = Number(tokens.getPropertyValue('--hero-stem-damping')) || 16;
    const animateEntrance = ready && !enteredRef.current && !reduced.matches && pointer.matches;
    if (ready) enteredRef.current = true;

    const extension = [0, 1].map(() => ({ value: animateEntrance ? 0 : 1, velocity: 0 }));
    const bend = [0, 1].map(() => ({ value: 0, velocity: 0 }));
    const targets = [0, 0];
    const lengths = [0, 0];
    const geometry = { left: 0, top: 0, scale: 1 };
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let inView = true;
    let pointerPosition: { x: number; y: number } | null = null;

    const paint = () => {
      const upLength = lengths[0] * extension[0].value;
      const downLength = lengths[1] * extension[1].value;
      const upBend = bend[0].value / geometry.scale;
      const downBend = bend[1].value / geometry.scale;
      const upperEnd = 296.032 - upLength;
      const lowerEnd = 455.969 + downLength;

      // Extend both edges of the stem inside its original outline. Cubic
      // tangents remain vertical at the attachment and keep the width constant.
      upperPath.setAttribute('d', glyphs[0].path.replace('V296.032H638.249V317.688',
        `V296.032C622.312 ${296.032 - upLength * 0.32} ${622.312 + upBend} ${upperEnd + upLength * 0.32} ${622.312 + upBend} ${upperEnd}` +
        `H${638.249 + upBend}C${638.249 + upBend} ${upperEnd + upLength * 0.32} 638.249 ${296.032 - upLength * 0.32} 638.249 296.032V317.688`));
      lowerPath.setAttribute('d', glyphs[5].path.replace('V455.969H91.1249Z',
        `V455.969C107.062 ${455.969 + downLength * 0.32} ${107.062 + downBend} ${lowerEnd - downLength * 0.32} ${107.062 + downBend} ${lowerEnd}` +
        `H${91.1249 + downBend}C${91.1249 + downBend} ${lowerEnd - downLength * 0.32} 91.1249 ${455.969 + downLength * 0.32} 91.1249 455.969Z`));
    };

    const updateTargets = () => {
      const interactive = ready && pointer.matches && !reduced.matches && inView && pointerPosition;
      for (let i = 0; i < 2; i++) {
        targets[i] = 0;
        if (!interactive || !pointerPosition) continue;
        const x = geometry.left + (i === 0 ? 642.2805 : 100.0935) * geometry.scale;
        const anchor = i === 0 ? 296.032 : 455.969;
        const y = geometry.top + (anchor + (i === 0 ? -1 : 1) * lengths[i] * 0.5) * geometry.scale;
        const dx = pointerPosition.x - x;
        const horizontal = Math.max(0, 1 - Math.abs(dx) / 300);
        const vertical = Math.max(0, 1 - Math.abs(pointerPosition.y - y) / Math.max(120, lengths[i] * geometry.scale * 0.8));
        targets[i] = bendLimit * Math.max(-1, Math.min(1, dx / 70)) * horizontal * vertical;
      }
    };

    const schedule = () => {
      if (!frame && inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      elapsed += dt;
      let moving = false;
      for (let i = 0; i < 2; i++) {
        const target = elapsed >= stagger * (i + 1) ? 1 : 0;
        if (animateEntrance) {
          advanceSpring(extension[i], target, dt, stiffness, damping);
          moving ||= target === 0 || extension[i].value !== 1;
        }
        advanceSpring(bend[i], targets[i], dt, 140, 24);
        moving ||= bend[i].value !== targets[i];
      }
      paint();
      if (moving) schedule();
      else last = 0;
    };

    const measure = () => {
      const mark = svg.getBoundingClientRect();
      const hero = section.getBoundingClientRect();
      geometry.scale = mark.height / 128 || 1;
      geometry.left = mark.left;
      geometry.top = mark.top - 296 * geometry.scale;
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 0;
      lengths[0] = Math.max(0, (mark.top - hero.top - headerHeight - clearance) / geometry.scale);
      lengths[1] = Math.max(0, (hero.bottom - clearance - (geometry.top + 455.969 * geometry.scale)) / geometry.scale);
      updateTargets();
      paint();
      schedule();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !pointer.matches || reduced.matches) return;
      pointerPosition = { x: event.clientX, y: event.clientY };
      updateTargets();
      schedule();
    };
    const leave = () => { pointerPosition = null; updateTargets(); schedule(); };
    const syncPreference = () => {
      if (reduced.matches || !pointer.matches) {
        elapsed = Math.max(elapsed, stagger * 2);
        for (const spring of extension) { spring.value = 1; spring.velocity = 0; }
        for (const spring of bend) { spring.value = 0; spring.velocity = 0; }
      }
      leave();
      paint();
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!document.hidden) { measure(); schedule(); }
    };
    const resize = new ResizeObserver(measure);
    resize.observe(svg);
    resize.observe(section);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        elapsed = Math.max(elapsed, stagger * 2);
        for (const spring of extension) { spring.value = 1; spring.velocity = 0; }
        leave();
      } else measure();
    });
    intersection.observe(section);
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', measure, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', syncPreference);
    pointer.addEventListener('change', syncPreference);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', measure);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', syncPreference);
      pointer.removeEventListener('change', syncPreference);
    };
  }, [ready]);

  return (
    <svg ref={svgRef} viewBox="0 296 757 128" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
      className="hero-mark" role="img" aria-label="Креатор" shapeRendering="geometricPrecision" data-ready={ready}>
      <g className="hero-mark-letters">
        {glyphs.map((glyph, index) => <path key={index} d={glyph.path} transform={`translate(${glyph.offset} 0)`}
          data-stem={index === 0 ? 'upper' : index === 5 ? 'lower' : undefined} />)}
      </g>
    </svg>
  );
};

