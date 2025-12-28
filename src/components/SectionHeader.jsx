import React from 'react';
import { motion } from 'framer-motion';

// export const SectionHeader = ({ title, subtitle }) => {
//   const letters = title.split("");

//   const container = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.05, 
//         // delayChildren: 0.2 // Small initial delay
//       },
//     },
//     // New Exit Variant: Staggers letters as they disappear
//     exit: {
//       opacity: 0,
//       transition: { 
//         staggerChildren: 0.02, 
//         staggerDirection: -1 // Reverse order (last letter first)
//       }
//     }
//   };

//   const child = {
//     hidden: {
//       opacity: 0,
//       y: 20,
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         damping: 12,
//         stiffness: 100,
//       },
//     },
//     // Letter-by-letter exit animation
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: 0.3
//       }
//     },
//   };

//   return (
//     <div className="mb-10">
//       <motion.h2
//         variants={container}
//         initial="hidden"
//         whileInView="visible"
//         exit="exit" 
//         /* Removed once: true so it repeats every time */
//         viewport={{ amount: 0.5 }} 
//         className="text-4xl md:text-5xl font-header font-black flex flex-wrap items-center"
//       >
//         <span className="flex flex-wrap bg-linear-to-r from-accent via-accent to-accent/50 bg-clip-text text-transparent">
//           {letters.map((letter, index) => (
//             <motion.span 
//               key={index} 
//               variants={child}
//               className={letter === " " ? "mr-4" : ""}
//             >
//               {letter}
//             </motion.span>
//           ))}
//         </span>

//         <motion.span 
//           initial={{ scaleX: 0 }}
//           whileInView={{ scaleX: 1 }}
//           exit={{ scaleX: 0 }}
//           transition={{ delay: 0.4, duration: 0.6, ease: "circOut" }}
//           className="block h-1.5 w-full max-w-30 bg-accent mt-4 origin-left rounded-full shadow-[0_0_15px_var(--accent-glow)]"
//         />
//       </motion.h2>

//       {subtitle && (
//         <motion.p 
//           initial={{ opacity: 0, x: -20 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           transition={{ delay: 0.2 }}
//           className="mt-6 text-muted font-mono text-sm md:text-base max-w-2xl border-l-2 border-accent/30 pl-6 leading-relaxed italic"
//         >
//           {subtitle}
//         </motion.p>
//       )}
//     </div>
//   );
// };

export const SectionHeader = ({ title, subtitle }) => {
  const letters = title.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="mb-12 md:mb-16">
      <motion.h2
        variants={container}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: false, amount: 0.3 }} 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-header font-black text-wrap"
      >
        <div className="flex flex-wrap items-baseline bg-gradient-to-r from-accent via-accent to-accent/50 bg-clip-text text-transparent">
          {letters.map((letter, index) => (
            <motion.span 
              key={index} 
              variants={child}
              // Improved spacing logic for mobile wrapping
              className={letter === " " ? "w-[0.25em]" : "inline-block"}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Animated Underline */}
        <motion.span 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
          className="block h-1 md:h-2 w-20 md:w-32 bg-accent mt-4 origin-left rounded-full shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]"
        />
      </motion.h2>

      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-muted font-mono text-xs sm:text-sm md:text-base max-w-2xl border-l-2 border-accent/30 pl-4 md:pl-6 leading-relaxed italic"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};