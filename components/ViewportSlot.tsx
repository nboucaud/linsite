
import React, { useRef, useState, useEffect } from 'react';

interface ViewportSlotProps {
  children: React.ReactNode;
  minHeight?: string | number; // Vital to prevent layout shift
  threshold?: number; // 0 to 1
  rootMargin?: string; // e.g. "200px" to load before it comes into view
  id?: string;
}

export const ViewportSlot: React.FC<ViewportSlotProps> = ({ 
  children, 
  minHeight = '50vh', 
  threshold = 0.1,
  rootMargin = '400px', // Start loading 400px before it hits the screen
  id
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          // Optional: Once loaded, we can stop observing if we want to keep it in DOM
          // observer.disconnect(); 
        } else {
          // Optional: Unmount when off-screen to save GPU? 
          // For heavy WebGL, yes, toggle isVisible. For static content, keep it.
          // We will keep isVisible true once loaded to prevent jitter, 
          // UNLESS the prop allows unmounting.
          // For this app, we simply lazy load ONCE.
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} id={id} style={{ minHeight }} className="w-full relative">
      {hasLoaded ? (
        <div className="animate-in fade-in duration-700">
          {children}
        </div>
      ) : (
        /* Loading Placeholder */
        <div className="w-full h-full flex items-center justify-center bg-transparent opacity-20">
           <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>
      )}
    </div>
  );
};
