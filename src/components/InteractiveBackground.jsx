
// import React, { useEffect, useRef } from 'react';
// import { motion, useMotionValue, useSpring } from 'framer-motion';

// export const InteractiveBackground = () => {
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const springX = useSpring(mouseX, { damping: 50, stiffness: 100 });
//   const springY = useSpring(mouseY, { damping: 50, stiffness: 100 });

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [mouseX, mouseY]);

//   return (
//     <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg">
//       <motion.div 
//         className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a192f] via-[#020c1b] to-[#01050d]"
//       />
      
//       {/* Dynamic Glow */}
//       <motion.div
//         className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-10 pointer-events-none"
//         style={{
//           x: springX,
//           y: springY,
//           translateX: '-50%',
//           translateY: '-50%',
//           background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
//         }}
//       />

//       {/* Grid Pattern */}
//       <div 
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage: `radial-gradient(#d4af37 0.5px, transparent 0.5px)`,
//           backgroundSize: '40px 40px',
//         }}
//       />
//     </div>
//   );
// };




import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const InteractiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg transition-colors duration-500">
      {/* 1. Base Layer: Uses your theme's --bg variable 
        2. Subtle Gradient: Uses var(--surface) for a theme-aware depth effect
      */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-40"
        style={{
          background: `linear-gradient(to bottom right, var(--surface), var(--bg))`,
        }}
      />
      
      {/* Dynamic Glow: 
        Now uses 'var(--accent)' so the glow color matches the theme (Gold, Cyan, Blue, etc.)
      */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.07] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        }}
      />

      {/* Grid Pattern: 
        Now uses 'var(--accent)' for the dots, making it look integrated in all modes.
      */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--accent) 0.5px, transparent 0.5px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};