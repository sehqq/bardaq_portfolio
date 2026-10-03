import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/bq.png';
import { OutlineText } from './ui/outline-text';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Обо мне', href: '#bio' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Контакты', href: '#contacts' },
];

interface HeaderProps {
  isLoaded?: boolean;
}

export const Header = ({ isLoaded }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isReady, setIsReady] = useState(Boolean(isLoaded));

  // Sync readiness strictly with loader completion
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded !== undefined) return;
    const handleLoadingComplete = () => setIsReady(true);
    window.addEventListener('loadingComplete', handleLoadingComplete);
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => {
      window.removeEventListener('loadingComplete', handleLoadingComplete);
      clearTimeout(timer);
    };
  }, [isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={isReady ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-40 transition-colors duration-300 border-b ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-white/10 shadow-lg'
          : 'bg-black/70 backdrop-blur-md border-white/15'
      }`}
    >
      <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-16 py-5 sm:py-6">
        {/* Logo (bq.png) with smooth scroll to top */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center cursor-pointer"
          aria-label="Наверх к началу страницы"
        >
          <img
            src={logo}
            alt="BQ Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav Items (stationary, fill to stroke transition) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-14" aria-label="Основная навигация">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="outline-text-trigger relative font-sans text-xl lg:text-2xl font-light text-white cursor-pointer"
            >
              <OutlineText className="nav-outline-text">{item.label}</OutlineText>
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white focus:outline-none cursor-pointer"
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/15 px-6 md:px-12 py-6 overflow-hidden flex flex-col gap-6"
            aria-label="Мобильная навигация"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="outline-text-trigger font-sans text-2xl font-light text-white"
              >
                <OutlineText className="nav-outline-text">{item.label}</OutlineText>
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
