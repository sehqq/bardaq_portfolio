import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { OutlineText } from './ui/outline-text';
import { HeroMark } from './ui/hero-mark';

const rotatingWords = [
  'проектов',
  'образов',
  'стратегий',
  'айдентики',
];

interface HeroSectionProps {
  isLoaded?: boolean;
}

// Each word owns its fill state, including while AnimatePresence retains it on exit.
const HeroWord = ({ word }: { word: string }) => {
  const [outlined, setOutlined] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setOutlined(true), 1000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <motion.span
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -6, transition: { duration: reducedMotion ? 0 : 0.2, ease: 'easeIn' } }}
      className="font-display whitespace-nowrap lowercase leading-none hero-rotating-word select-none"
    >
      <OutlineText outlined={outlined} className="hero-outline-text">{word}</OutlineText>
    </motion.span>
  );
};

export const HeroSection = ({ isLoaded }: HeroSectionProps) => {
  const phraseRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const isReady = isLoaded ?? loadingComplete;
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollHintOpacity = useTransform(scrollY, [0, 96], [1, 0]);

  useEffect(() => {
    const phrase = phraseRef.current;
    if (!phrase) return;
    const context = document.createElement('canvas').getContext('2d');
    if (!context) return;
    let active = true;

    // Fit the whole phrase once against the widest word, keeping every word
    // at the same size. Recalculate after fonts load and on container resize.
    const fitPhrase = () => {
      if (!active) return;
      const slot = phrase.querySelector<HTMLElement>('.hero-word-slot');
      if (!slot) return;
      const font = getComputedStyle(phrase).getPropertyValue('--font-display').trim();
      context.font = `100px ${font}`;
      const wordWidth = Math.max(...rotatingWords.map(word =>
        context.measureText(word).width / 100 + word.length * Number(getComputedStyle(phrase).getPropertyValue('--hero-word-tracking')),
      ));
      const graphicWidth = 0.667 * 757 / 128;
      const gap = parseFloat(getComputedStyle(slot).paddingLeft);
      const size = (phrase.clientWidth - gap - 6) / (graphicWidth + wordWidth);
      phrase.style.setProperty('--hero-phrase-size', `${size}px`);
    };
    const observer = new ResizeObserver(fitPhrase);
    observer.observe(phrase);
    fitPhrase();
    void document.fonts.ready.then(fitPhrase);
    return () => { active = false; observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (isLoaded !== undefined) return;
    const handleLoadingComplete = () => setLoadingComplete(true);
    window.addEventListener('loadingComplete', handleLoadingComplete);
    const timer = setTimeout(() => setLoadingComplete(true), 500);
    return () => {
      window.removeEventListener('loadingComplete', handleLoadingComplete);
      clearTimeout(timer);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isReady || reducedMotion) return;

    // Fill-to-outline timing is local to the mounted word, never reset on exit.
    const nextTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4200);

    return () => {
      clearTimeout(nextTimer);
    };
  }, [index, isReady, reducedMotion]);

  return (
    <section
      id="hero"
      style={{ opacity: isReady ? 1 : 0 }}
      className="relative min-h-screen w-full flex flex-col justify-between px-6 md:px-12 lg:px-16 pt-24 pb-8 border-b border-white/15 overflow-hidden transition-opacity duration-300"
    >
      {/* Top spacer for fixed header clearance */}
      <div className="w-full h-4 sm:h-8" />

      {/* Main Hero Single-Row Phrase: «Креатор» (left) + rotating word (centered in right area) */}
      <div ref={phraseRef} className="hero-phrase w-full my-auto flex flex-row items-baseline justify-start select-none overflow-visible leading-none -translate-y-8 sm:-translate-y-10">
        <div className="w-full flex flex-row items-baseline justify-start overflow-visible">
          {/* Left: Graphic word «Креатор» fixed with full-screen guidelines */}
          <div className="relative shrink-0 inline-flex items-baseline overflow-visible">
            <HeroMark ready={isReady} />
          </div>

          {/* Right Area: Dedicated space from «Креатор» to right edge, with word centered */}
          <div className="hero-word-slot min-w-0 flex-1 flex justify-center items-baseline overflow-visible pl-4 sm:pl-6 md:pl-8">
            <AnimatePresence mode="wait" onExitComplete={() => setDisplayedIndex(index)}>
              {isReady && <HeroWord key={rotatingWords[index]} word={rotatingWords[index]} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hero Bottom scroll indicator pinned to bottom right corner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        className="w-full flex justify-end items-end text-xs sm:text-sm font-sans font-extralight tracking-widest text-text-muted uppercase pt-4"
      >
        <motion.div className="flex items-center gap-5 sm:gap-8" style={{ opacity: scrollHintOpacity }}>
          <span className="hero-word-counter" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={displayedIndex} initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 3 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
                transition={{ duration: reducedMotion ? 0 : 0.15 }}>
                {String(displayedIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="hero-counter-total"> / {String(rotatingWords.length).padStart(2, '0')}</span>
          </span>
          <span className="flex items-center gap-2">
          <span>Scroll down</span>
          <ArrowDown size={13} strokeWidth={1.25} aria-hidden="true" className="scroll-hint-arrow" data-ready={isReady} />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
