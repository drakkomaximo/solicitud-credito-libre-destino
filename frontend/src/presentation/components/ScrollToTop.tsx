'use client';

import { useEffect, useState } from 'react';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({
  threshold = 300,
  className = 'fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-2xl text-white shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500',
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={className}
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}
