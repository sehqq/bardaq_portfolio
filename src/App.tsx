import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CasesCarousel } from './components/CasesCarousel';
import { CaseDetailModal } from './components/CaseDetailModal';
import { ContactsSection } from './components/ContactsSection';
import type { CaseItem } from './data/cases';
import ParticleField from './components/ui/particle-field';

function App() {
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  return (
    <div className="portfolio-shell w-full min-h-screen m-0 p-0 overflow-x-hidden text-white relative selection:bg-white selection:text-black">
      <ParticleField />
      {/* Interactive Cursor */}
      <CustomCursor />

      {/* Initial Loading Entrance Screen */}
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Fixed Glassmorphic Navigation Header */}
      <Header isLoaded={!loading} />

      {/* Main Full-Width Content */}
      <main className="w-full">
        {/* 1. Hero Section */}
        <HeroSection isLoaded={!loading} />

        {/* 2. Bio / About Section */}
        <AboutSection />

        {/* 3. 3D Cases Carousel */}
        <CasesCarousel onSelectCase={(item) => setSelectedCase(item)} isCaseOpen={selectedCase !== null} />
      </main>

      {/* 4. Contacts & Footer Section */}
      <ContactsSection />

      {/* Case gallery dialog */}
      <CaseDetailModal
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
}

export default App;
