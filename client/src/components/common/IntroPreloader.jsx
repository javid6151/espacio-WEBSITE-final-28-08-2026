import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export const IntroPreloader = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem('espacio_intro_shown') !== 'true';
    } catch {
      return true;
    }
  });

  const handleComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('espacio_intro_shown', 'true');
    } catch {}
  };

  useEffect(() => {
    if (!showIntro) return;
    // Auto-complete after animation completes
    const timer = setTimeout(() => {
      handleComplete();
    }, 4200);
    return () => clearTimeout(timer);
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #16171d 0%, #0a0b0d 80%)'
          }}
          onClick={handleComplete}
        >
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0,
              y: -80,
              scale: 0.94,
              transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] }
            }}
            className="flex flex-col items-center select-none"
          >
            <Logo scrolled={false} size="large" onComplete={handleComplete} />

            {/* Tagline: DESIGNING SPACES / DEFINING LIFESTYLES */}
            <div className="mt-2 flex flex-col items-center text-center space-y-0.5 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '0.24em',
                  textShadow: '0 2px 20px rgba(201, 169, 110, 0.4)'
                }}
                className="text-[16px] sm:text-[20px] md:text-[23px] text-[#C9A96E] uppercase font-extrabold leading-tight"
              >
                Designing Spaces
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '0.24em',
                  textShadow: '0 2px 20px rgba(255, 255, 255, 0.25)'
                }}
                className="text-[16px] sm:text-[20px] md:text-[23px] text-[#FFFFFF] uppercase font-extrabold leading-tight"
              >
                Defining Lifestyles
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroPreloader;
