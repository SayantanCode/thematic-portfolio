// import React from 'react';
// import { motion } from 'framer-motion';
// import { SectionHeader } from './SectionHeader';
// import { Calendar, Database, Activity, Mail, FastForward } from 'lucide-react';

// const ProjectCard = ({ index, title, description, tags, icon, animation }) => {
//   return (
//     <div className="sticky top-24 mb-12">
//       <motion.div 
//         className="glass-card p-8 md:p-12 rounded-2xl flex flex-col lg:flex-row gap-12 items-center"
//         initial={{ y: 50, opacity: 0 }}
//         whileInView={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.1 }}
//         viewport={{ margin: "-100px" }}
//       >
//         <div className="lg:w-1/2">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-accent/10 rounded-lg text-accent border border-accent/20">
//               {icon}
//             </div>
//             <span className="text-muted font-mono text-sm uppercase tracking-widest">
//               Case Study 0{index + 1}
//             </span>
//           </div>
//           {/* text-primary ensures it's white in dark mode and black in light mode */}
//           <h3 className="text-3xl font-header font-bold text-primary mb-6 leading-tight">
//             {title}
//           </h3>
//           <p className="text-muted mb-8 leading-relaxed text-lg">
//             {description}
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {tags.map(tag => (
//               <span 
//                 key={tag} 
//                 className="px-3 py-1 bg-surface border border-glass-border rounded-full text-xs font-mono text-accent"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Animation Container: Replaced hardcoded bg with bg-surface/30 and theme border */}
//         <div className="lg:w-1/2 flex justify-center bg-surface/30 rounded-xl p-8 border border-glass-border relative overflow-hidden h-80 min-h-[300px]">
//           {animation}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export const CoreSystems = () => {
//   const cards = [
//     {
//       title: "The Universal Recurrence Engine",
//       description: "Engineered a sophisticated multi-rule repetition logic for tee-time bookings. Handled 'Every 2nd Tuesday of the Month' and 'Block Repeat' overrides with zero collision risk.",
//       tags: ["Node.js", "Day.js", "MongoDB Indexing"],
//       icon: <Calendar size={24} />,
//       animation: (
//         <div className="relative w-full h-full flex items-center justify-center">
//           <motion.div 
//             animate={{ rotate: 360 }}
//             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             className="w-48 h-48 border-2 border-dashed border-accent/20 rounded-full flex items-center justify-center"
//           >
//             <div className="absolute top-0 w-4 h-4 bg-accent rounded-full shadow-[0_0_15px_var(--accent)]" />
//             <div className="w-32 h-32 border-2 border-accent/10 rounded-full flex items-center justify-center">
//               <Calendar className="text-accent opacity-50" size={40} />
//             </div>
//           </motion.div>
//           <div className="absolute bottom-0 left-4 font-mono text-[10px] text-muted uppercase tracking-tighter">
//             System Logic: Recursive Cron Expansion
//           </div>
//         </div>
//       )
//     },
//     {
//       title: "Async Report Pipeline",
//       description: "A decoupled worker architecture that handles massive CSV exports. Requests are queued in Redis, processed by secondary workers, and delivered via signed cloud storage URLs.",
//       tags: ["Redis", "BullMQ", "AWS S3"],
//       icon: <FastForward size={24} />,
//       animation: (
//         <div className="w-full flex items-center justify-between px-10">
//           <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="p-4 glass-card rounded-lg border-accent/30">
//             <Database size={24} className="text-accent" />
//           </motion.div>
//           <div className="flex-1 h-0.5 bg-accent/20 relative overflow-hidden">
//              <motion.div 
//                animate={{ x: ['-100%', '200%'] }} 
//                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
//                className="absolute h-full w-20 bg-accent/40 blur-sm"
//              />
//           </div>
//           <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="p-4 glass-card rounded-lg border-accent/30">
//             <Mail size={24} className="text-accent" />
//           </motion.div>
//         </div>
//       )
//     },
//     {
//       title: "Real-time Booking Core",
//       description: "Implemented a sub-100ms locking mechanism using Redlock pattern to prevent double-booking of slots during peak demand windows for professional tours.",
//       tags: ["Socket.io", "Redis Locks", "Node.js Cluster"],
//       icon: <Activity size={24} />,
//       animation: (
//         <div className="flex flex-col items-center justify-center gap-4">
//           <div className="text-6xl font-header text-accent tabular-nums">
//             <motion.span
//               animate={{ opacity: [0.5, 1, 0.5] }}
//               transition={{ repeat: Infinity, duration: 2 }}
//             >
//               1,284
//             </motion.span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
//             <span className="font-mono text-xs text-muted uppercase tracking-widest">Active concurrent bookings</span>
//           </div>
//           {/* Fixed ProgressBar: uses bg-surface instead of hardcoded midnight */}
//           <div className="w-48 h-1 bg-surface rounded-full overflow-hidden border border-glass-border">
//             <motion.div 
//               className="h-full bg-accent" 
//               animate={{ width: ['20%', '90%', '60%', '80%'] }}
//               transition={{ repeat: Infinity, duration: 4 }}
//             />
//           </div>
//         </div>
//       )
//     }
//   ];

//   return (
//     <section className="container mx-auto px-6 py-24">
//       <SectionHeader 
//         title="Core Systems" 
//         subtitle="Inside the Golf POS Case Study — Scaling from 10 to 1,000+ clubs." 
//       />
      
//       <div className="max-w-6xl mx-auto">
//         {cards.map((card, i) => (
//           <ProjectCard key={i} index={i} {...card} />
//         ))}
//       </div>
//     </section>
//   );
// };


import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Calendar, Database, Activity, Mail, FastForward } from 'lucide-react';

const ProjectCard = ({ index, title, description, tags, icon, animation }) => {
  return (
    // Responsive Sticky: Added more breathing room on mobile (top-16 vs top-32)
    <div className="sticky top-16 md:top-24 mb-16 md:mb-32 group">
      <motion.div 
        className="glass-card p-6 sm:p-8 md:p-12 rounded-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center border border-glass-border hover:border-accent/30 transition-colors duration-500"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ margin: "-50px", once: true }} // Once: true prevents repetitive jarring jumps on scroll
      >
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="p-2.5 sm:p-3 bg-accent/10 rounded-lg text-accent border border-accent/20 group-hover:bg-accent group-hover:text-bg transition-all duration-500">
              {icon}
            </div>
            <span className="text-muted font-mono text-[10px] sm:text-xs uppercase tracking-widest">
              Case Study 0{index + 1}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-header font-bold text-primary mb-4 md:mb-6 leading-tight">
            {title}
          </h3>
          
          <p className="text-muted mb-6 md:mb-8 leading-relaxed text-sm sm:text-base md:text-lg">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-surface/50 border border-glass-border rounded-full text-[10px] sm:text-xs font-mono text-accent/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Animation Container: Adjusted height for mobile so it doesn't push text off-screen */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-surface/30 rounded-xl p-6 sm:p-8 border border-glass-border relative overflow-hidden h-64 sm:h-80 order-1 lg:order-2">
          {/* Subtle Background Glow for the animation area */}
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          {animation}
        </div>
      </motion.div>
    </div>
  );
};

export const CoreSystems = () => {
   const cards = [
    {
      title: "The Universal Recurrence Engine",
      description: "Engineered a sophisticated multi-rule repetition logic for tee-time bookings. Handled 'Every 2nd Tuesday of the Month' and 'Block Repeat' overrides with zero collision risk.",
      tags: ["Node.js", "Day.js", "MongoDB Indexing"],
      icon: <Calendar size={24} />,
      animation: (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border-2 border-dashed border-accent/20 rounded-full flex items-center justify-center"
          >
            <div className="absolute top-0 w-4 h-4 bg-accent rounded-full shadow-[0_0_15px_var(--accent)]" />
            <div className="w-32 h-32 border-2 border-accent/10 rounded-full flex items-center justify-center">
              <Calendar className="text-accent opacity-50" size={40} />
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-4 font-mono text-[10px] text-muted uppercase tracking-tighter">
            System Logic: Recursive Cron Expansion
          </div>
        </div>
      )
    },
    {
      title: "Async Report Pipeline",
      description: "A decoupled worker architecture that handles massive CSV exports. Requests are queued in Redis, processed by secondary workers, and delivered via signed cloud storage URLs.",
      tags: ["Redis", "BullMQ", "AWS S3"],
      icon: <FastForward size={24} />,
      animation: (
        <div className="w-full flex items-center justify-between px-10">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="p-4 glass-card rounded-lg border-accent/30">
            <Database size={24} className="text-accent" />
          </motion.div>
          <div className="flex-1 h-0.5 bg-accent/20 relative overflow-hidden">
             <motion.div 
               animate={{ x: ['-100%', '200%'] }} 
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute h-full w-20 bg-accent/40"
             />
          </div>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="p-4 glass-card rounded-lg border-accent/30">
            <Mail size={24} className="text-accent" />
          </motion.div>
        </div>
      )
    },
    {
      title: "Real-time Booking Core",
      description: "Implemented a sub-100ms locking mechanism using Redlock pattern to prevent double-booking of slots during peak demand windows for professional tours.",
      tags: ["Socket.io", "Redis Locks", "Node.js Cluster"],
      icon: <Activity size={24} />,
      animation: (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-6xl font-header text-accent tabular-nums">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              1,284
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs text-muted uppercase tracking-widest">Active concurrent bookings</span>
          </div>
          {/* Fixed ProgressBar: uses bg-surface instead of hardcoded midnight */}
          <div className="w-48 h-1 bg-surface rounded-full overflow-hidden border border-glass-border">
            <motion.div 
              className="h-full bg-accent" 
              animate={{ width: ['20%', '90%', '60%', '80%'] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
          </div>
        </div>
      )
    }
  ];
  
  return (
    <section className="container mx-auto px-6 md:px-12 pt-12 pb-12 md:pb-24 text-primary border-b border-glass-border">
      <SectionHeader 
        title="Core Systems" 
        subtitle="Inside the Golf POS Case Study — Scaling from 10 to 1,000+ clubs." 
      />
      
      <div className="max-w-5xl mx-auto">
        {cards.map((card, i) => (
          <ProjectCard key={i} index={i} {...card} />
        ))}
      </div>
    </section>
  );
};

