import { useEffect, useState } from 'react';
import CloudLoader from '@/components/ui/quantum-cloud-loader';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Quantum cloud loader active for initial loading interval
    const spinTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    return () => clearTimeout(spinTimer);
  }, []);

  useEffect(() => {
    if (!isFadingOut) return;

    // Dispatch completion and unmount exactly when 0.8s fade-out completes
    const exitTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('loadingComplete'));
      onComplete();
    }, 800);

    return () => clearTimeout(exitTimer);
  }, [isFadingOut, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
        isFadingOut ? 'pointer-events-none' : ''
      }`}
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      <CloudLoader />
    </div>
  );
};

