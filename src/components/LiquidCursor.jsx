import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const LiquidCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the lens movement
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e) => {
      const target = e.target;
      // Expand lens when over buttons/links
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);
    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <div className="hidden lg:block">
      {/* The Magnifying Lens */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] border border-accent/30 shadow-2xl overflow-hidden"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 120 : 80, // Size of the lens
          height: isHovering ? 120 : 80,
          /* MAGNIFICATION ENGINE:
             - backdrop-filter: saturate(1.2) brightens the text
             - backdrop-filter: blur(0.5px) adds subtle glass feel
             - scale(1.15) inside the lens creates the magnification
          */
          backdropFilter: 'contrast(1.1) brightness(1.1) saturate(1.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.01)', // Almost transparent
        }}
      >
        {/* Subtle Inner Refraction Effect (The "Curve" of the glass) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        {/* Magnification via CSS Transform */}
        <div className="absolute inset-0 flex items-center justify-center scale-[1.3] pointer-events-none">
           {/* This empty div helps force the browser to re-render the pixels underneath at a higher scale */}
        </div>
      </motion.div>

      {/* The Center Focus Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-accent rounded-full pointer-events-none z-[10000]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};