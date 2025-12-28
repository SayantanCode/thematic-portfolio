
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Github, Linkedin, Mail, Twitter, ChevronUp } from 'lucide-react';

// export const Footer= () => {
//   const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

//   return (
//     <footer className="relative pt-24 pb-12 overflow-hidden">
//       <div className="container mx-auto px-6 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           className="mb-16"
//         >
//           <h2 className="text-4xl md:text-6xl font-header font-black text-white mb-6 uppercase tracking-tighter">
//             Let's build <br /> <span className="text-golden">something scalable</span>
//           </h2>
//           <p className="text-gray-400 mb-8 font-mono">
//             Currently available for specialized backend consulting & contract roles.
//           </p>
//           <motion.a 
//             href="mailto:hello@example.com"
//             whileHover={{ scale: 1.05 }}
//             className="inline-flex items-center gap-4 px-10 py-5 bg-text-primary text-surface font-black rounded-sm shadow-gold interactive text-lg"
//           >
//             HIRE ME <Mail size={20} />
//           </motion.a>
//         </motion.div>

//         <div className="flex justify-center gap-8 mb-16">
//           {[
//             { Icon: Github, href: "#" },
//             { Icon: Linkedin, href: "#" },
//             { Icon: Twitter, href: "#" }
//           ].map(({ Icon, href }, i) => (
//             <motion.a
//               key={i}
//               href={href}
//               whileHover={{ y: -5, color: '#d4af37' }}
//               className="text-gray-500 transition-colors"
//             >
//               <Icon size={24} />
//             </motion.a>
//           ))}
//         </div>

//         <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
//               <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Server: Optimal</span>
//             </div>
//             <div className="hidden sm:block h-3 w-px bg-white/10" />
//             <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Uptime: 99.9%</span>
//           </div>

//           <button 
//             onClick={scrollToTop}
//             className="p-3 border border-white/10 rounded-full text-gray-500 hover:text-golden hover:border-golden transition-all"
//           >
//             <ChevronUp size={20} />
//           </button>

//           <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
//             &copy; 2024 Built with precision
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };


import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ChevronUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-glass-border">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          {/* text-primary for theme-aware heading */}
          <h2 className="text-4xl md:text-6xl font-header font-black text-primary mb-6 uppercase tracking-tighter">
            Let's build <br /> 
            <span className="text-accent drop-shadow-[0_0_10px_var(--accent-glow)]">
              something scalable
            </span>
          </h2>
          
          <p className="text-muted mb-8 font-mono text-sm max-w-md mx-auto">
            Currently available for specialized backend consulting & contract roles.
          </p>

          <motion.a 
            href="mailto:sayantan648@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            /* text-bg makes the text the background color for high contrast on the button */
            className="inline-flex items-center gap-4 px-10 py-5 bg-accent text-bg font-black rounded-sm shadow-lg hover:shadow-accent/40 interactive text-lg"
          >
            HIRE ME <Mail size={20} />
          </motion.a>
        </motion.div>

        {/* Social Icons - Theme Aware Hover */}
        <div className="flex justify-center gap-8 mb-16">
          {[
            { Icon: Github, href: "#" },
            { Icon: Linkedin, href: "#" },
            { Icon: Twitter, href: "#" }
          ].map(({ Icon, href }, i) => (
            <motion.a
              key={i}
              href={href}
              whileHover={{ y: -5 }}
              /* text-muted for default, text-accent for hover */
              className="text-muted hover:text-accent transition-colors duration-300"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </div>

        {/* Bottom Bar - Fixed borders and text */}
        <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                Server: Optimal
              </span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-glass-border" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Uptime: 99.9%
            </span>
          </div>

          <button 
            onClick={scrollToTop}
            className="p-3 border border-glass-border rounded-full text-muted hover:text-accent hover:border-accent transition-all shadow-sm"
          >
            <ChevronUp size={20} />
          </button>

          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
};