
// import React from 'react';
// import { motion } from 'framer-motion';
// import { SectionHeader } from './SectionHeader';
// import { ArrowRight } from 'lucide-react';
// import { BLOG_POSTS } from '../constants/BlogConstants'

// export const Insights= () => {
//   return (
//     <section className="container mx-auto px-6 py-24">
//       <SectionHeader 
//         title="Technical Insights" 
//         subtitle="Sharing architecture patterns and performance wins." 
//       />

//       <div className="space-y-4">
//         {BLOG_POSTS.map((post, i) => (
//           <motion.div
//             key={i}
//             className="group relative glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-accent/5 border-transparent border-b-accent/30"
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <div className="max-w-2xl">
//               <div className="flex items-center gap-4 mb-2">
//                 <span className="text-xs font-mono text-accent">{post.date}</span>
//                 <span className="text-[10px] px-2 py-0.5 border border-white/10 rounded-full text-gray-500 uppercase tracking-widest">{post.readTime}</span>
//               </div>
//               <h4 className="text-2xl font-header font-bold text-white group-hover:text-accent transition-colors mb-2">
//                 {post.title}
//               </h4>
//               <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
//             </div>
            
//             <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
//               <span className="text-xs font-mono text-gray-500 uppercase">Read Article</span>
//               <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
//                 <ArrowRight size={18} />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };


import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants/BlogConstants';

export const Insights = () => {
  return (
    <section className="container mx-auto px-6 py-24">
      <SectionHeader 
        title="Technical Insights" 
        subtitle="Sharing architecture patterns and performance wins." 
      />

      <div className="space-y-4">
        {BLOG_POSTS.map((post, i) => (
          <motion.div
            key={i}
            className="group relative glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-accent/5 border-transparent border-b-accent/30"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-mono text-accent font-bold">
                  {post.date}
                </span>
                <span className="text-[10px] px-2 py-0.5 border border-glass-border rounded-full text-muted uppercase tracking-widest bg-surface/50">
                  {post.readTime}
                </span>
              </div>
              
              {/* text-primary flips color based on theme automatically */}
              <h4 className="text-2xl font-header font-bold text-primary group-hover:text-accent transition-colors mb-2">
                {post.title}
              </h4>
              
              <p className="text-muted text-sm leading-relaxed max-w-xl">
                {post.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
              <span className="text-xs font-mono text-muted uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                Read Article
              </span>
              
              {/* Fixed: group-hover:text-bg ensures visibility on all accent colors */}
              <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-all shadow-sm group-hover:shadow-accent/40">
                <ArrowRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};