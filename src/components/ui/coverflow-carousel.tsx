'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CoverflowSlideMeta {
  label: string;
  value: React.ReactNode;
}

export interface CoverflowSlide {
  src: string;
  alt?: string;
  imageBlendMode?: React.CSSProperties['mixBlendMode'];
  imageScale?: number;
  title: string;
  subtitle: string;
  meta: CoverflowSlideMeta[];
  id?: string;
}

export interface CoverflowCarouselProps {
  slides?: CoverflowSlide[];
  items?: CoverflowSlide[];
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  onOpenCase?: (slide: CoverflowSlide, index: number) => void;
  showCaption?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  autoplay?: boolean;
  autoPlayInterval?: number;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  className?: string;
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  gap?: number;
  fade?: number;
  cardWidth?: string;
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({
  slides,
  items,
  activeIndex: controlledIndex,
  onIndexChange,
  onOpenCase,
  showCaption = true,
  loop = true,
  autoPlay = true,
  autoplay,
  autoPlayInterval = 3600,
  autoplayDelay,
  className,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  gap = 0.05,
  fade = 0.1,
  cardWidth = 'clamp(280px, 30vw, 420px)',
}) => {
  const isAutoPlayEnabled = autoplay !== undefined ? autoplay : autoPlay;
  const effectiveInterval = autoplayDelay !== undefined ? autoplayDelay : autoPlayInterval;
  const allSlides = useMemo(() => slides || items || [], [slides, items]);
  const count = allSlides.length;

  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Continuous coordinate tracking for infinite seamless looping
  const targetRef = useRef(activeIndex);
  const progressRef = useRef(activeIndex);
  const cardWidthPxRef = useRef(300);
  const animFrameRef = useRef<number | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // User activity timeout ref for 5s pause on manual interaction
  const userInteractionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserPausedRef = useRef(false);

  const triggerUserInteractionPause = useCallback(() => {
    isUserPausedRef.current = true;

    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }

    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserPausedRef.current = false;
    }, 5000);
  }, []);

  // Measure card width in pixels from DOM
  const measure = useCallback(() => {
    const firstCard = cardsRef.current[0];
    if (firstCard && firstCard.offsetWidth > 0) {
      cardWidthPxRef.current = firstCard.offsetWidth;
    }
  }, []);

  // Clamp function: when loop=true, do NOT constrain bounds
  const clamp = useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  // Exact 3D transformation paint formula
  const paint = useCallback(
    (pos: number) => {
      const cards = cardsRef.current;
      const width = cardWidthPxRef.current || 300;

      // Pitch calculation: projected card width plus gap
      const pitch = width * (Math.cos((rotate * Math.PI) / 180) + gap);

      allSlides.forEach((_, index) => {
        const card = cards[index];
        if (!card) return;

        // 1. Исходная разница без деления с остатком в первой строке:
        let offset = index - pos;

        // 2. Сворачивание кольца строго по оригинальной формуле:
        if (loop) {
          offset = ((offset % count) + count) % count;
          if (offset > count / 2) offset -= count;
        }

        const distance = Math.abs(offset);
        const ramp = Math.pow(distance, falloff);
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

        // 3. Формула 3D-трансформации (минус перед tilt обязателен для наклона к центру):
        card.style.transform =
          `translateX(calc(-50% + ${offset * pitch}px)) ` +
          `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

        // Половина круга — точка математического перехода
        const halfCount = count / 2;

        // Карточка должна быть полностью невидима при подходе к halfCount.
        // Задаём порог полного растворения чуть раньше границы переворота (например, за 0.3 шага до края),
        // а начало затухания — за 1.3 шага до края.
        const fadeEnd = halfCount - 0.25;
        const fadeStart = Math.max(1.2, halfCount - 1.25);

        let edge = 1;
        if (loop && halfCount > 1) {
          if (distance >= fadeEnd) {
            edge = 0;
          } else if (distance > fadeStart) {
            const progress = (fadeEnd - distance) / (fadeEnd - fadeStart);
            // Smoothstep для плавного и органичного растворения в темноте
            edge = progress * progress * (3 - 2 * progress);
          } else {
            edge = 1;
          }
        }

        const baseOpacity = Math.max(0, 1 - fade * distance);
        const finalOpacity = Math.max(0, Math.min(1, baseOpacity * edge));

        card.style.opacity = String(finalOpacity);
        card.style.visibility = finalOpacity <= 0.005 ? "hidden" : "visible";
        card.style.zIndex = String(Math.max(1, Math.round((count - distance) * 10)));
      });
    },
    [allSlides, count, loop, rotate, gap, falloff, depth, fade]
  );

  // Settle animation function with faster, springier interpolation (0.22)
  const settle = useCallback(
    (to: number) => {
      targetRef.current = to;
      const normalized = ((Math.round(to) % count) + count) % count;
      if (!isControlled) {
        setInternalIndex(normalized);
      }
      onIndexChange?.(normalized);

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      const animate = () => {
        const diff = targetRef.current - progressRef.current;
        if (Math.abs(diff) < 0.002) {
          progressRef.current = targetRef.current;
          paint(progressRef.current);
          animFrameRef.current = null;
          return;
        }

        progressRef.current += diff * 0.22;
        paint(progressRef.current);
        animFrameRef.current = requestAnimationFrame(animate);
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [count, isControlled, onIndexChange, paint]
  );

  // Nudge function: accumulates coordinate steps without boundary reset
  const nudge = useCallback(
    (by: number) => {
      const nextTarget = loop
        ? Math.round(targetRef.current) + by
        : clamp(Math.round(targetRef.current) + by);
      settle(nextTarget);
    },
    [clamp, loop, settle]
  );

  // Discrete force step for continuous uninterrupted autoplay
  const forceStep = useCallback(() => {
    // Не перебиваем, если пользователь физически зажал карточку пальцем/мышью
    if (isDraggingRef.current) return;

    // Округляем до ближайшей целевой позиции и строго шагаем на +1
    const nextTarget = Math.round(targetRef.current) + 1;
    settle(nextTarget);
  }, [settle]);

  const forceStepRef = useRef(forceStep);
  useIsoLayoutEffect(() => { forceStepRef.current = forceStep; }, [forceStep]);

  // Go to specific card index taking the shortest circular distance
  const goTo = useCallback(
    (index: number) => {
      if (!loop) {
        settle(clamp(index));
        return;
      }
      const current = targetRef.current;
      const currentWrapped = ((current % count) + count) % count;
      let diff = index - currentWrapped;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      settle(current + diff);
    },
    [clamp, count, loop, settle]
  );

  // Direct paint on mount via useIsoLayoutEffect
  useIsoLayoutEffect(() => {
    measure();
    paint(progressRef.current);

    const frame = requestAnimationFrame(() => {
      measure();
      paint(progressRef.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [measure, paint]);

  // Autoplay support: pure, continuous, background interval with 5s manual interaction pause
  useEffect(() => {
    if (!isAutoPlayEnabled || count <= 1) return;

    const intervalId = setInterval(() => {
      if (!isDraggingRef.current && !isUserPausedRef.current) {
        forceStepRef.current();
      }
    }, effectiveInterval || 3500);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAutoPlayEnabled, effectiveInterval, count]);

  // A temporary autoplay pause must not cancel the user's interaction timeout.
  useEffect(() => () => {
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
  }, []);

  // Sync controlled index only when explicitly provided from outside
  useEffect(() => {
    if (isControlled && controlledIndex !== undefined) {
      const currentWrapped = ((targetRef.current % count) + count) % count;
      if (currentWrapped !== controlledIndex) {
        goTo(controlledIndex);
      }
    }
  }, [isControlled, controlledIndex, count, goTo]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      measure();
      paint(progressRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [measure, paint]);

  // Reset dragging state on blur or tab switch
  useEffect(() => {
    const handleWindowBlur = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  // Global pointer up fallback so drag state never sticks
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        triggerUserInteractionPause();
        isDraggingRef.current = false;
        const rounded = clamp(Math.round(progressRef.current));
        settle(rounded);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [clamp, settle, triggerUserInteractionPause]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      triggerUserInteractionPause();
      nudge(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      triggerUserInteractionPause();
      nudge(1);
    }
  };

  // Pointer drag / swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    triggerUserInteractionPause();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = progressRef.current;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    triggerUserInteractionPause();
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }

    const width = cardWidthPxRef.current || 300;
    const pitch = width * (Math.cos((rotate * Math.PI) / 180) + gap);

    const deltaProgress = deltaX / pitch;
    progressRef.current = clamp(dragStartProgressRef.current - deltaProgress);
    paint(progressRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    triggerUserInteractionPause();
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const rounded = clamp(Math.round(progressRef.current));
    settle(rounded);
  };

  if (count === 0) return null;

  const normalizedActive = ((Math.round(activeIndex) % count) + count) % count;
  const activeSlide = allSlides[normalizedActive];

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full flex flex-col items-center select-none outline-none', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="3D Coverflow Carousel"
      style={{
        '--cf-card': cardWidth,
      } as React.CSSProperties}
    >
      {/* 1. External Scroll Container with perspective and touchAction: pan-y */}
      <div
        ref={frameRef}
        className="relative w-full flex items-center justify-center overflow-visible py-4 sm:py-6"
        style={{
          perspective: `calc(var(--cf-card) * ${perspective})`,
          touchAction: 'pan-y',
        }}
      >
        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerUserInteractionPause();
            nudge(-1);
          }}
          aria-label="Предыдущий кейс"
          className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-[300] p-3 rounded-full border border-white/20 bg-black/70 hover:bg-white/15 text-white/80 hover:text-white backdrop-blur-md transition-all duration-200 pointer-events-auto cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 2. Internal Container where cards are mapped - strictly has preserve-3d */}
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative select-none w-full flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing"
          style={{
            height: 'var(--cf-card)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Soft Ambient Spotlight behind active card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.06] rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* 3D Cards Deck */}
          {allSlides.map((slide, idx) => {
            const isActive = idx === normalizedActive;

            return (
              <div
                key={slide.id || `${slide.title}-${idx}`}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDraggedRef.current) return;

                  triggerUserInteractionPause();
                  if (isActive) {
                    onOpenCase?.(slide, idx);
                  } else {
                    goTo(idx);
                  }
                }}
                className={cn(
                  'absolute aspect-square rounded-3xl overflow-hidden',
                  'bg-[#121212] border border-white/10 shadow-2xl',
                  'cursor-pointer select-none pointer-events-auto transition-shadow duration-300'
                )}
                style={{
                  width: 'var(--cf-card)',
                  height: 'var(--cf-card)',
                  left: '50%',
                  top: '50%',
                  marginTop: 'calc(var(--cf-card) / -2)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Centered Floating Image with Breathing Room */}
                <div className="flex h-full w-full items-center justify-center p-8">
                  <img
                    src={slide.src}
                    alt={slide.alt || slide.title}
                    draggable={false}
                    className="max-h-full max-w-full object-contain select-none pointer-events-none drop-shadow-md"
                    style={{
                      mixBlendMode: slide.imageBlendMode,
                      transform: slide.imageScale ? `scale(${slide.imageScale})` : undefined,
                    }}
                  />
                </div>

                {/* Shading overlay for depth on side cards */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/25 hover:bg-black/10 transition-colors duration-200 pointer-events-none rounded-3xl" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerUserInteractionPause();
            nudge(1);
          }}
          aria-label="Следующий кейс"
          className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-[300] p-3 rounded-full border border-white/20 bg-black/70 hover:bg-white/15 text-white/80 hover:text-white backdrop-blur-md transition-all duration-200 pointer-events-auto cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Active Card Info Caption Underneath */}
      {showCaption && activeSlide && (
        <div className="w-full max-w-xl mx-auto mt-8 sm:mt-10 px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id || activeSlide.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Title (Первая строка): Название проекта */}
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {activeSlide.title}
              </h3>

              {/* Subtitle (Вторая строка): Категория */}
              <p className="text-sm md:text-base text-zinc-400 font-light mt-1">
                {activeSlide.subtitle}
              </p>

              {/* Meta-информация */}
              {activeSlide.meta && activeSlide.meta.length > 0 && (
                <dl className="max-w-[320px] mx-auto mt-6 text-xs md:text-sm space-y-2">
                  {activeSlide.meta.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-baseline gap-4">
                      <dt className="text-zinc-400 shrink-0">{item.label}</dt>
                      <dd className="text-white font-medium text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Кнопка «Открыть кейс» */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => onOpenCase?.(activeSlide, normalizedActive)}
                  className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2 text-xs uppercase tracking-wider text-white transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer group"
                >
                  <span>Открыть кейс</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors duration-200" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CoverflowCarousel;
