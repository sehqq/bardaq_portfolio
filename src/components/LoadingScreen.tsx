import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import CloudLoader from '@/components/ui/quantum-cloud-loader';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const reducedMotion = useReducedMotion();
  const fadeDuration = reducedMotion ? 0 : 800;

  useEffect(() => {
    // Keep the original introduction visible before its gradual fade-out.
    const spinTimer = setTimeout(() => setIsFadingOut(true), 1800);
    return () => clearTimeout(spinTimer);
  }, []);

  useEffect(() => {
    if (!isFadingOut) return;

    const exitTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('loadingComplete'));
      onComplete();
    }, fadeDuration);

    return () => clearTimeout(exitTimer);
  }, [isFadingOut, onComplete, fadeDuration]);

  return (
    <div
      data-loading-screen
      role="status"
      aria-label="Загрузка портфолио"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
        isFadingOut ? 'pointer-events-none' : ''
      }`}
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: `opacity ${fadeDuration}ms ease-out`,
      }}
    >
      <CloudLoader />
    </div>
  );
};

