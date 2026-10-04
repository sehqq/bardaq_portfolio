import React from 'react';
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel';
import { casesData, type CaseItem } from '../data/cases';

import error404Img from '../assets/images/figma-404.png';
import pixultImg from '../assets/images/figma-pixult.png';
import studVibe1Img from '../assets/images/figma-stud-vibe-1.png';
import studVibe2Img from '../assets/images/figma-stud-vibe-2.png';
import postersImg from '../assets/images/figma-posters.png';
import logosImg from '../assets/images/figma-logotypes.png';

export interface CasesCarouselProps {
  onSelectCase?: (caseItem: CaseItem) => void;
  isCaseOpen?: boolean;
}

const CASE_SLIDES: CoverflowSlide[] = [
  {
    src: error404Img,
    imageBlendMode: 'screen',
    alt: 'Music label "404" Brandbook',
    title: 'Music label "404"',
    subtitle: 'Brandbook',
    meta: [
      { label: 'Год', value: '2026' },
      { label: 'Инструменты', value: 'Figma · Illustrator · Photoshop' },
    ],
    id: '404-concept',
  },
  {
    src: pixultImg,
    imageScale: 0.9,
    alt: 'PIXULT Brandbook',
    title: 'PIXULT',
    subtitle: 'Brandbook',
    meta: [
      { label: 'Год', value: '2025' },
      { label: 'Инструменты', value: 'Illustrator · Photoshop' },
    ],
    id: 'pixult',
  },
  {
    src: studVibe1Img,
    imageScale: 1.1,
    alt: 'СТУД.ВАЙБ 1 Выпуск Полиграфия',
    title: 'СТУД.ВАЙБ 1 Выпуск',
    subtitle: 'Полиграфия',
    meta: [
      { label: 'Год', value: '2026' },
      { label: 'Инструменты', value: 'Illustrator · Photoshop' },
    ],
    id: 'stud-vibe-1',
  },
  {
    src: studVibe2Img,
    imageScale: 1.1,
    alt: 'СТУД.ВАЙБ 2 Выпуск Полиграфия',
    title: 'СТУД.ВАЙБ 2 Выпуск',
    subtitle: 'Полиграфия',
    meta: [
      { label: 'Год', value: '2026' },
      { label: 'Инструменты', value: 'Illustrator · Photoshop' },
    ],
    id: 'stud-vibe-2',
  },
  {
    src: postersImg,
    alt: 'Posters Сборник',
    title: 'Posters',
    subtitle: 'Сборник',
    meta: [
      { label: 'Год', value: '2025–2026' },
      { label: 'Инструменты', value: 'Figma · Illustrator · Photoshop' },
    ],
    id: 'posters',
  },
  {
    src: logosImg,
    alt: 'Logotypes Сборник',
    title: 'Logotypes',
    subtitle: 'Сборник',
    meta: [
      { label: 'Год', value: '2025–2026' },
      { label: 'Инструменты', value: 'Figma · Illustrator · Photoshop' },
    ],
    id: 'logos',
  },
];

export const CasesCarousel: React.FC<CasesCarouselProps> = ({ onSelectCase, isCaseOpen = false }) => {
  const handleOpenCase = (slide: CoverflowSlide) => {
    if (!onSelectCase) return;

    // Find the corresponding full CaseItem in casesData
    const foundCase = casesData.find(
      (c) =>
        c.id === slide.id ||
        c.title.toLowerCase() === slide.title.toLowerCase() ||
        c.title.toLowerCase().includes(slide.title.toLowerCase())
    );

    if (foundCase) {
      onSelectCase(foundCase);
    } else {
      // Create a fallback CaseItem if not matched by ID
      const fallbackCase: CaseItem = {
        id: slide.id || slide.title.toLowerCase().replace(/\s+/g, '-'),
        title: slide.title,
        subtitle: slide.subtitle,
        category: slide.subtitle,
        year: String(slide.meta?.find((m) => m.label === 'Год')?.value || '2026'),
        image: slide.src,
        description: `${slide.title} — ${slide.subtitle}`,
        tags: [slide.subtitle, 'Дизайн'],
        deliverables: ['Презентация проекта', 'Графические материалы'],
      };
      onSelectCase(fallbackCase);
    }
  };

  return (
    <section
      id="cases"
      className="relative w-full min-h-screen pt-28 md:pt-32 lg:pt-36 pb-20 overflow-hidden flex flex-col justify-between border-b border-white/15"
    >
      {/* Section Header */}
      <div className="relative w-full px-6 md:px-12 lg:px-16 mb-2 sm:mb-4 pt-[15px]" style={{ paddingTop: '15px' }}>
        {/* Left Badge: 02 / КЕЙСЫ aligned with Section 03 vertical guide and top offset */}
        <div className="md:absolute left-6 md:left-12 lg:left-16 top-[15px] z-10 mb-4 md:mb-0" style={{ top: '15px' }}>
          <span
            className="font-sans font-extralight text-xs sm:text-sm tracking-widest text-text-muted uppercase block"
            style={{ fontFamily: "'Geist', sans-serif", fontWeight: 200 }}
          >
            02 / КЕЙСЫ
          </span>
        </div>

        {/* Centered Headline with zero top margin starting on the exact same horizontal top line as badge */}
        <h2 className="cases-section-heading font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight mx-auto max-w-4xl text-center m-0 p-0">
          От идей и пикселей <br />
          до рабочих проектов
        </h2>
      </div>

      {/* 3D Coverflow Carousel */}
      <div className="w-full px-4 sm:px-6 md:px-8 mt-6 sm:mt-8">
        <CoverflowCarousel
          slides={CASE_SLIDES}
          onOpenCase={handleOpenCase}
          autoPlay={!isCaseOpen}
          showCaption={true}
          loop={true}
          rotate={44}
          depth={0.6}
          perspective={3}
          falloff={0.56}
          gap={0.05}
          fade={0.1}
          cardWidth="clamp(280px, 30vw, 420px)"
        />
      </div>
    </section>
  );
};

// Aliases for alternate naming requested
export const ProjectsSection = CasesCarousel;
export const CasesSection = CasesCarousel;
export default CasesCarousel;
