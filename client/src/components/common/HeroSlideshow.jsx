import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

/**
 * Preloads image URLs into browser memory and pre-decodes bitmap assets
 * before they are rendered in transitions.
 */
const preloadImages = (urls = []) => {
  if (!Array.isArray(urls)) return;
  urls.forEach((url) => {
    if (!url || typeof url !== 'string') return;
    const img = new Image();
    img.src = url;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
};

const HeroSlideshow = memo(({
  images = [],
  intervalMs = 2800,
  transitionDuration = 1.0,
  className = "absolute inset-0 w-full h-full object-cover",
  onIndexChange,
  showGradient = true,
  gradientClassName = "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10 pointer-events-none"
}) => {
  const activeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const imagesKey = activeImages.join('|');

  // Preload all active images in parallel on mount for pure HD instantaneous rendering
  useEffect(() => {
    if (activeImages.length > 0) {
      preloadImages(activeImages);
    }
  }, [imagesKey]);

  // Notify parent on index change
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Main slideshow timer with tab visibility pause
  useEffect(() => {
    if (activeImages.length <= 1) return;

    const startTimer = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeImages.length);
      }, intervalMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timerRef.current);
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeImages.length, intervalMs, onIndexChange]);

  // Safety check for empty image array
  if (activeImages.length === 0) return null;

  const rawSrc = activeImages[currentIndex % activeImages.length];
  const currentSrc = rawSrc;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {activeImages.map((src, idx) => {
        const isActive = idx === (currentIndex % activeImages.length);
        return (
          <motion.img
            key={src}
            src={src}
            alt="ESPACIO Hero Showcase"
            decoding="async"
            fetchPriority={idx === 0 ? "high" : "auto"}
            initial={false}
            animate={isActive ? {
              opacity: 1,
              scale: 1.0,
            } : {
              opacity: 0,
              scale: 1.08,
            }}
            transition={{
              duration: transitionDuration,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: transitionDuration * 0.85, ease: [0.4, 0, 0.2, 1] }
            }}
            style={{
              zIndex: isActive ? 2 : 1,
              transformOrigin: idx % 2 === 0 ? 'center center' : 'top center',
              imageRendering: 'high-quality',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
            className={`${className} object-cover transform-gpu`}
          />
        );
      })}

      {showGradient && <div className={gradientClassName} />}
    </div>
  );
});

HeroSlideshow.displayName = 'HeroSlideshow';

export default HeroSlideshow;
