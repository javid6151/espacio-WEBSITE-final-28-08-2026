import React from 'react';
import { motion } from 'framer-motion';

const ScrollDownIndicator = ({ light = false, className = '' }) => {
  const textColor = light ? 'text-ink/70' : 'text-white/70';
  const iconColor = light ? 'text-ink/65' : 'text-white/65';

  return (
    <motion.div 
      className={`absolute bottom-3 sm:bottom-4.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
    >
      <motion.span 
        className={`font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] drop-shadow-md ${textColor}`}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll Down.
      </motion.span>
      <motion.div
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-3.5 h-3.5 ${iconColor} flex items-center justify-center drop-shadow-md`}
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollDownIndicator;
