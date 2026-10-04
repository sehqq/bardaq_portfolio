import { useEffect, useId, useRef, useState } from 'react';

// Original letter contours; extensions are joined into these same paths below.
const glyphs = [
  { offset: 6, path: 'M686.249 408.063C699.499 408.063 710.812 403.375 720.187 394C729.562 384.625 734.249 373.313 734.249 360.063C734.249 346.813 729.562 335.5 720.187 326.125C710.812 316.75 699.499 312.063 686.249 312.063C672.999 312.063 661.687 316.75 652.312 326.125C642.937 335.5 638.249 346.813 638.249 360.063C638.249 373.313 642.937 384.625 652.312 394C661.687 403.375 672.999 408.063 686.249 408.063ZM622.312 455.969V296.032H638.249V317.688C639.124 316.688 640.062 315.719 641.062 314.781C653.562 302.282 668.624 296.032 686.249 296.032C703.937 296.032 719.03 302.282 731.53 314.781C744.03 327.281 750.28 342.375 750.28 360.063C750.28 377.688 744.03 392.75 731.53 405.25C719.03 417.75 703.937 424 686.249 424C668.624 424 653.562 417.75 641.062 405.25C640.062 404.313 639.124 403.344 638.249 402.344V455.969H622.312Z' },
  { offset: 5, path: 'M547.124 408.063C560.374 408.063 571.687 403.375 581.062 394C590.437 384.625 595.124 373.313 595.124 360.063C595.124 346.813 590.437 335.501 581.062 326.126C571.687 316.751 560.374 312.063 547.124 312.063C533.874 312.063 522.562 316.751 513.187 326.126C503.812 335.501 499.124 346.813 499.124 360.063C499.124 373.313 503.812 384.625 513.187 394C522.562 403.375 533.874 408.063 547.124 408.063ZM547.124 424C529.499 424 514.437 417.75 501.937 405.25C489.437 392.75 483.187 377.688 483.187 360.063C483.187 342.376 489.437 327.282 501.937 314.782C514.437 302.282 529.499 296.032 547.124 296.032C564.812 296.032 579.905 302.282 592.405 314.782C604.905 327.282 611.155 342.376 611.155 360.063C611.155 377.688 604.905 392.75 592.405 405.25C579.905 417.75 564.812 424 547.124 424Z' },
  { offset: 4, path: 'M452.624 424V312.063H436.687V296.032H484.687V312.063H468.656V424H452.624Z' },
  { offset: 3, path: 'M393.468 408.063C397.906 408.063 401.687 406.5 404.812 403.375C407.937 400.25 409.499 396.469 409.499 392.032C409.499 387.594 407.937 383.813 404.812 380.688C401.687 377.563 397.906 376 393.468 376C389.031 376 385.249 377.563 382.124 380.688C378.999 383.813 377.437 387.594 377.437 392.032C377.437 396.469 378.999 400.25 382.124 403.375C385.249 406.5 389.031 408.063 393.468 408.063ZM393.468 424C384.656 424 377.093 420.907 370.781 414.719C364.593 408.407 361.5 400.844 361.5 392.032C361.5 383.219 364.593 375.688 370.781 369.438C377.093 363.188 384.656 360.063 393.468 360.063C399.343 360.063 404.687 361.438 409.499 364.188V328.001C409.499 323.626 407.906 319.876 404.718 316.751C401.593 313.626 397.843 312.063 393.468 312.063C389.031 312.063 385.249 313.626 382.124 316.751C378.999 319.876 377.437 323.626 377.437 328.001H361.5C361.5 319.188 364.625 311.657 370.874 305.407C377.124 299.157 384.656 296.032 393.468 296.032C402.281 296.032 409.812 299.157 416.062 305.407C422.312 311.657 425.437 319.188 425.437 328.001V424H409.499V419.875C404.687 422.625 399.343 424 393.468 424Z' },
  { offset: 2, path: 'M335.625 344.032C333.375 337.407 329.562 331.438 324.187 326.126C314.812 316.751 303.5 312.063 290.25 312.063C277 312.063 265.687 316.751 256.312 326.126C251 331.438 247.187 337.407 244.875 344.032H335.625ZM290.25 424C272.625 424 257.562 417.75 245.062 405.25C232.562 392.75 226.312 377.688 226.312 360.063C226.312 342.376 232.562 327.282 245.062 314.782C257.562 302.282 272.625 296.032 290.25 296.032C307.937 296.032 323.031 302.282 335.531 314.782C348.031 327.282 354.281 342.376 354.281 360.063H242.25C242.25 373.313 246.937 384.625 256.312 394C265.687 403.375 277 408.063 290.25 408.063C296.812 408.063 303.062 406.813 309 404.313C314.75 401.875 319.812 398.438 324.187 394L335.531 405.25C329.656 411.188 322.875 415.782 315.187 419.032C307.25 422.344 298.937 424 290.25 424Z' },
  { offset: 1, path: 'M155.062 408.063C168.312 408.063 179.625 403.375 189 394C198.375 384.625 203.062 373.313 203.062 360.063C203.062 346.813 198.375 335.501 189 326.126C179.625 316.751 168.312 312.063 155.062 312.063C141.812 312.063 130.5 316.751 121.125 326.126C111.75 335.501 107.062 346.813 107.062 360.063C107.062 373.313 111.75 384.625 121.125 394C130.5 403.375 141.812 408.063 155.062 408.063ZM91.1249 455.969V296.032H107.062V317.688C107.937 316.688 108.875 315.719 109.875 314.782C122.375 302.282 137.437 296.032 155.062 296.032C172.75 296.032 187.843 302.282 200.343 314.782C212.843 327.282 219.093 342.376 219.093 360.063C219.093 377.688 212.843 392.75 200.343 405.25C187.843 417.75 172.75 424 155.062 424C137.437 424 122.375 417.75 109.875 405.25C108.875 404.313 107.937 403.344 107.062 402.344V455.969H91.1249Z' },
  { offset: 0, path: 'M0 424V240H15.9375V376C29.1875 376 40.4999 371.313 49.8749 361.938C59.2499 352.563 63.9374 341.251 63.9374 328.001V240H79.9686V328.001C79.9686 345.688 73.7187 360.782 61.2187 373.282C54.6562 379.844 47.4062 384.688 39.4687 387.813L79.9686 408.063V424L15.9375 392.032V424H0Z' },
 ];

export const HeroMark = ({ ready }: { ready: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const fillSpotRef = useRef<SVGCircleElement>(null);
  const outlineSpotRef = useRef<SVGCircleElement>(null);
  const id = useId().replace(/:/g, '');
  const [bounds, setBounds] = useState({ top: -500, bottom: 1300 });
  useEffect(() => {
    const svg = svgRef.current;
    const section = svg?.closest('section');
    if (!svg || !section) return;
    const measure = () => {
      const mark = svg.getBoundingClientRect();
      const hero = section.getBoundingClientRect();
      const scale = mark.height / 128;
      if (!scale) return;
      const phrase = svg.closest('.hero-phrase');
      const stacked = phrase && getComputedStyle(phrase).getPropertyValue('--hero-stacked').trim() === '1';
      const word = phrase?.querySelector('.hero-word-slot')?.getBoundingClientRect();
      // Mobile stems end within the composition rather than at viewport edges.
      const upperEdge = stacked ? mark.top - Math.min(96, Math.max(64, hero.height * 0.1)) : hero.top;
      const top = 296 + (upperEdge - mark.top) / scale;
      const lowerEdge = stacked && word ? word.top - 24 : hero.bottom;
      const bottom = Math.max(488, 296 + (lowerEdge - mark.top) / scale);
      setBounds(previous => Math.abs(previous.top - top) < 0.1 && Math.abs(previous.bottom - bottom) < 0.1
        ? previous : { top, bottom });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const section = svg?.closest('section');
    const fillSpot = fillSpotRef.current;
    const outlineSpot = outlineSpotRef.current;
    if (!svg || !section || !fillSpot || !outlineSpot) return;

    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const current = { x: 0, y: 360, amount: 0 };
    const target = { ...current };
    let radius = 0;
    let frame = 0;
    let last = 0;

    const paint = () => {
      for (const spot of [fillSpot, outlineSpot]) {
        spot.setAttribute('cx', String(current.x));
        spot.setAttribute('cy', String(current.y));
        spot.setAttribute('r', String(radius * (0.65 + current.amount * 0.35)));
        spot.setAttribute('opacity', String(current.amount));
      }
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      const positionEase = reduced.matches ? 1 : 1 - Math.exp(-dt / 0.055);
      const revealEase = reduced.matches ? 1 : 1 - Math.exp(-dt / 0.12);
      current.x += (target.x - current.x) * positionEase;
      current.y += (target.y - current.y) * positionEase;
      current.amount += (target.amount - current.amount) * revealEase;
      const settled = Math.abs(current.x - target.x) < 0.05 && Math.abs(current.y - target.y) < 0.05
        && Math.abs(current.amount - target.amount) < 0.001;
      if (settled) Object.assign(current, target);
      paint();
      if (!settled) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const leave = () => { target.amount = 0; schedule(); };
    const move = (event: PointerEvent) => {
      if (!ready || !pointer.matches || event.pointerType !== 'mouse') return;
      const box = svg.getBoundingClientRect();
      const scale = box.height / 128;
      if (!scale) return;
      const x = (event.clientX - box.left) / scale;
      const y = 296 + (event.clientY - box.top) / scale;
      const hero = section.getBoundingClientRect();
      if (x < 0 || x > 757 || event.clientY < hero.top || event.clientY > hero.bottom) { leave(); return; }
      const radiusPx = parseFloat(getComputedStyle(svg).getPropertyValue('--hero-outline-radius'));
      radius = Math.min(Number.isFinite(radiusPx) ? radiusPx : box.height * 0.95, box.height * 0.95) / scale;
      // Start at the pointer rather than sweeping in from the previous hover.
      if (current.amount === 0) { current.x = x; current.y = y; }
      target.x = x;
      target.y = y;
      target.amount = 1;
      schedule();
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      target.amount = current.amount = 0;
      paint();
    };
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', leave, { passive: true });
    window.addEventListener('resize', reset);
    pointer.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', leave);
      window.removeEventListener('resize', reset);
      pointer.removeEventListener('change', reset);
      reduced.removeEventListener('change', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, [ready]);
  const upperLines = [{ x: 0, width: 15.9375, end: 240 }, { x: 628.312, width: 15.937, end: 296.032 }];
  const lowerLines = [{ x: 92.1249, width: 15.9371, start: 455.969 }, { x: 456.624, width: 16.032, start: 424 }];
  // Change the outer contour itself, so no stroke crosses an internal join.
  const extendedGlyphs = glyphs.map((glyph, index) => {
    let path = glyph.path;
    if (index === 0) path = path.replace('V296.032H638.249V317.688', `V${bounds.top}H638.249V317.688`);
    if (index === 2) path = path.replaceAll('424', String(bounds.bottom));
    if (index === 5) path = path.replace('M91.1249 455.969', `M91.1249 ${bounds.bottom}`)
      .replace('V455.969H91.1249Z', `V${bounds.bottom}H91.1249Z`);
    if (index === 6) path = path.replace('V240', `V${bounds.top}`);
    return { ...glyph, path };
  });
  const maskTop = Math.min(bounds.top, 208) - 32;
  const maskBottom = Math.max(bounds.bottom, 488) + 32;
  const gradientOffset = (y: number) => Math.max(0, Math.min(1, (y - bounds.top) / (bounds.bottom - bounds.top)));
  return (
    <svg ref={svgRef} viewBox="0 296 757 128" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
      className="hero-mark" role="img" aria-label="Креатор" shapeRendering="geometricPrecision" data-ready={ready}>
      <defs>
        <radialGradient id={`${id}-erase`}>
          <stop offset="0.18" className="hero-mask-hidden" stopOpacity="1" />
          <stop offset="0.5" className="hero-mask-hidden" stopOpacity="0.92" />
          <stop offset="0.78" className="hero-mask-hidden" stopOpacity="0.35" />
          <stop offset="1" className="hero-mask-hidden" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-outline`}>
          <stop offset="0.18" className="hero-mask-visible" stopOpacity="1" />
          <stop offset="0.5" className="hero-mask-visible" stopOpacity="0.92" />
          <stop offset="0.78" className="hero-mask-visible" stopOpacity="0.35" />
          <stop offset="1" className="hero-mask-visible" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-fill-mask`} maskUnits="userSpaceOnUse" x="-32" y={maskTop} width="821" height={maskBottom - maskTop} style={{ maskType: 'luminance' }}>
          <rect x="-32" y={maskTop} width="821" height={maskBottom - maskTop} className="hero-mask-base" />
          <circle ref={fillSpotRef} r="0" opacity="0" fill={`url(#${id}-erase)`} />
        </mask>
        <mask id={`${id}-outline-mask`} maskUnits="userSpaceOnUse" x="-32" y={maskTop} width="821" height={maskBottom - maskTop} style={{ maskType: 'alpha' }}>
          <circle ref={outlineSpotRef} r="0" opacity="0" fill={`url(#${id}-outline)`} />
        </mask>
        {upperLines.map((line, index) => (
          <linearGradient key={index} id={`${id}-up-${index}`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={bounds.top} y2={bounds.bottom}>
            <stop offset="0" className="hero-line-edge" />
            <stop offset={gradientOffset(bounds.top + (line.end - bounds.top) * 0.55)} className="hero-line-middle" />
            <stop offset={gradientOffset(line.end)} className="hero-line-core" /><stop offset="1" className="hero-line-core" />
          </linearGradient>
        ))}
        {lowerLines.map((line, index) => (
          <linearGradient key={index} id={`${id}-down-${index}`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={bounds.top} y2={bounds.bottom}>
            <stop offset="0" className="hero-line-core" /><stop offset={gradientOffset(line.start)} className="hero-line-core" />
            <stop offset={gradientOffset(line.start + (bounds.bottom - line.start) * 0.45)} className="hero-line-middle" />
            <stop offset="1" className="hero-line-edge" />
          </linearGradient>
        ))}
        <clipPath id={`${id}-entrance`} clipPathUnits="userSpaceOnUse">
          <rect x="-32" y="238" width="821" height="220" />
          {upperLines.map((line, index) => <rect key={`up-${index}`} x={line.x - 2} y={bounds.top - 2}
            width={line.width + 4} height={Math.max(0, line.end + 4 - bounds.top)} className="hero-guide hero-guide-up" />)}
          {lowerLines.map((line, index) => <rect key={`down-${index}`} x={line.x - 2} y={line.start - 2}
            width={line.width + 4} height={Math.max(0, bounds.bottom - line.start + 4)} className="hero-guide hero-guide-down" />)}
        </clipPath>
      </defs>
      <g className="hero-mark-letters" clipPath={`url(#${id}-entrance)`}>
        <g mask={`url(#${id}-fill-mask)`}>
          {extendedGlyphs.map((glyph, index) => <path key={index} d={glyph.path} transform={`translate(${glyph.offset} 0)`}
            fill={index === 0 ? `url(#${id}-up-1)` : index === 6 ? `url(#${id}-up-0)`
              : index === 2 ? `url(#${id}-down-1)` : index === 5 ? `url(#${id}-down-0)` : undefined} />)}
        </g>
        <g mask={`url(#${id}-outline-mask)`} className="hero-mark-outline" fill="none" stroke="currentColor">
          {extendedGlyphs.map((glyph, index) => <path key={index} d={glyph.path} transform={`translate(${glyph.offset} 0)`} vectorEffect="non-scaling-stroke"
            stroke={index === 0 ? `url(#${id}-up-1)` : index === 6 ? `url(#${id}-up-0)`
              : index === 2 ? `url(#${id}-down-1)` : index === 5 ? `url(#${id}-down-0)` : undefined} />)}
        </g>
      </g>
    </svg>
  );
};
