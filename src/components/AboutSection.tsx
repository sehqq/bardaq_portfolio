import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import bioPhoto1 from '../assets/images/Gemini_Generated_Image_m8nddem8nddem8nd 1.png';
import bioPhoto2 from '../assets/images/Gemini_Generated_Image_9xgvha9xgvha9xgv 1.png';
import bioPhoto3 from '../assets/images/уыаываываы 1.png';

const bioSlides = [
  { id: 1, src: bioPhoto1, alt: 'Егор Павловский — графический и веб-дизайнер' },
  { id: 2, src: bioPhoto2, alt: 'Процесс работы над айдентикой и визуалом' },
  { id: 3, src: bioPhoto3, alt: 'Визуальные системы и дизайн-концепты' },
];

const SLIDE_DURATION = 4500; // 4.5 seconds per slide

export const AboutSection = () => {
  const [{ current: currentSlide, previous: previousSlide }, setSlide] = useState({ current: 0, previous: 0 });
  const reducedMotion = useReducedMotion();

  const selectSlide = (current: number) => {
    setSlide((slide) => slide.current === current ? slide : { current, previous: slide.current });
  };

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setSlide((slide) => ({ current: (slide.current + 1) % bioSlides.length, previous: slide.current }));
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentSlide, reducedMotion]);

  return (
    <section
      id="bio"
      className="w-full min-h-screen flex items-center justify-center border-b border-white/15 overflow-hidden relative"
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: '8vh 6vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[5vw] items-center"
        style={{
          width: '100%',
          maxWidth: '1720px',
          margin: '0 auto',
        }}
      >
        {/* 1. Left Column: Text & Typography */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Section label: Geist, extralight, clamp(18px, 1.2vw, 24px), color #71717a, mb 24px */}
          <span
            className="font-extralight"
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 200,
              fontSize: 'clamp(18px, 1.2vw, 24px)',
              color: '#71717a',
              marginBottom: '24px',
              display: 'block',
              letterSpacing: '0.02em',
            }}
          >
            Обо мне
          </span>

          {/* Main Headline: clamp(48px, 4.2vw, 80px), leading 1.05, 2 lines natural break */}
          <h2
            style={{
              fontSize: 'clamp(48px, 4.2vw, 80px)',
              lineHeight: 1.05,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: 'clamp(24px, 2.5vw, 44px)',
            }}
          >
            Егор — Web & Graphic Designer
          </h2>

          {/* Body paragraphs: clamp(18px, 1.3vw, 24px), leading 1.55, color #d4d4d8, mb 24px */}
          <div style={{ maxWidth: '780px' }}>
            <p
              style={{
                fontSize: 'clamp(18px, 1.3vw, 24px)',
                lineHeight: 1.55,
                color: 'var(--color-bio-body)',
                fontWeight: 400,
                marginBottom: '24px',
              }}
            >
              Живу в Казани, учусь на направлении бренд-коммуникаций и дизайна рекламы.
            </p>
            <p
              style={{
                fontSize: 'clamp(18px, 1.3vw, 24px)',
                lineHeight: 1.55,
                color: 'var(--color-bio-body)',
                fontWeight: 400,
                marginBottom: '24px',
              }}
            >
              Разрабатываю айдентику и визуальные системы, создаю сайты и приложения, работаю с анимацией и интерактивностью. Для реализации проектов использую код и генеративный ИИ.
            </p>
            <p
              style={{
                fontSize: 'clamp(18px, 1.3vw, 24px)',
                lineHeight: 1.55,
                color: 'var(--color-bio-body)',
                fontWeight: 400,
                marginBottom: '0px',
              }}
            >
              Для меня хороший проект — это когда выразительный визуал работает на конкретную идею, а не существует отдельно от неё.
            </p>
          </div>
        </div>

        {/* 2. Right Column: Media Photo Card */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              height: 'clamp(620px, 48vw, 820px)',
              borderRadius: '32px',
              overflow: 'hidden',
              position: 'relative',
              marginLeft: 'auto',
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Persistent images: incoming photo fades over an opaque outgoing photo. */}
            {bioSlides.map((slide, idx) => (
              <img
                key={slide.id}
                src={slide.src}
                alt={idx === currentSlide ? slide.alt : ''}
                aria-hidden={idx !== currentSlide}
                data-active={idx === currentSlide}
                data-previous={idx === previousSlide}
                data-transition={currentSlide !== previousSlide}
                className="bio-photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  position: 'absolute',
                  inset: 0,
                  zIndex: idx === currentSlide ? 2 : idx === previousSlide ? 1 : 0,
                  willChange: 'opacity',
                  opacity: idx === currentSlide || idx === previousSlide ? 1 : 0,
                }}
              />
            ))}

            {/* Gradient for bottom contrast */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '140px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 60%, transparent)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />

            {/* Stories progress indicators pinned to bottom: 28px, left: 28px, right: 28px */}
            <div
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '28px',
                right: '28px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              {bioSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => selectSlide(idx)}
                  style={{
                    flex: 1,
                    height: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    outline: 'none',
                  }}
                  aria-label={`Перейти к слайду ${idx + 1}`}
                  aria-pressed={idx === currentSlide}
                >
                  {idx === currentSlide && (
                    <motion.div
                      key={`progress-${idx}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: reducedMotion ? 0 : SLIDE_DURATION / 1000,
                        ease: 'linear',
                      }}
                      style={{
                        height: '100%',
                        width: '100%',
                        transformOrigin: 'left',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                      }}
                    />
                  )}
                  {idx < currentSlide && (
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BioSection = AboutSection;
