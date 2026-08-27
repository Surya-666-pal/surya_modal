import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function FlightTransition({ children }) {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Scroll to top immediately when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (shouldReduceMotion) {
    return (
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="w-full min-h-[calc(100vh-80px)]"
      >
        {children}
      </motion.div>
    );
  }

  // Flying Airplane Page Transition Variants (~650ms total)
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 35,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        delay: 0.22, // Enters in the wake of the plane
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -30,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Flying Saffron Airplane & Arc Route Layer (Overlay on transition) */}
      <motion.div
        key={`flight-plane-${location.pathname}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 0.7, times: [0, 0.1, 0.6, 0.85, 1] }}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      >
        {/* Airplane along Bezier Flight Arc */}
        <motion.div
          initial={{
            x: '-15vw',
            y: '45vh',
            rotate: -20,
            scale: 0.75,
          }}
          animate={{
            x: ['-15vw', '25vw', '52vw', '80vw', '115vw'],
            y: ['45vh', '30vh', '22vh', '28vh', '42vh'],
            rotate: [-20, -12, 4, 18, 26],
            scale: [0.8, 1.15, 1.28, 1.1, 0.85],
          }}
          transition={{
            duration: 0.68,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(240,147,43,0.6)]"
        >
          {/* Custom Saffron Paper Airplane Icon SVG */}
          <div className="relative">
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14 text-saffron fill-saffron"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                fill="#F0932B"
              />
              <path
                d="M2 10l15 2-15 2V10z"
                fill="#FFA726"
                opacity="0.6"
              />
            </svg>

            {/* Jet stream / Sparkle glow at nozzle */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-300 blur-sm animate-ping" />
          </div>
        </motion.div>

        {/* Dynamic Dotted Flight Path Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <motion.path
            d="M -100 300 Q 300 120, 500 150 T 1100 300"
            fill="none"
            stroke="#F0932B"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.8 }}
            animate={{ pathLength: [0, 1], opacity: [0.8, 0] }}
            transition={{
              duration: 0.68,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      {/* Page Content Animation Container */}
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full min-h-[calc(100vh-80px)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
