import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Code2, ChevronRight, Copy } from 'lucide-react';
import { CODE_SNIPPETS } from '../constants/CodeSnippetsConstants';

const CodeCard = ({ snippet }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-80 w-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden glass-card p-6 flex flex-col justify-between rounded-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
               <Code2 className="text-accent" size={24} />
               <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
                 {snippet.language}
               </span>
            </div>
            {/* text-primary flips from white to black based on theme */}
            <h4 className="text-xl font-header font-bold text-primary mb-2">
              {snippet.title}
            </h4>
            <p className="text-sm text-muted line-clamp-3 leading-relaxed">
              {snippet.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
             <span className="text-[10px] font-mono text-accent uppercase tracking-tight">
               Hover to Inspect
             </span>
             <ChevronRight className="text-accent/40" size={16} />
          </div>
        </div>

        {/* Back Side (The Code Snippet) */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-surface p-4 flex flex-col rounded-xl border border-accent/30 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3 border-b border-glass-border pb-2">
            <span className="text-[10px] font-mono text-accent font-bold">SOURCE_CODE</span>
            <button className="hover:text-accent transition-colors text-muted">
                <Copy size={14} />
            </button>
          </div>
          
          {/* pre tag now uses text-primary for theme-aware syntax colors */}
          <pre className="font-mono text-[11px] text-primary overflow-hidden leading-relaxed whitespace-pre-wrap flex-1 opacity-90">
            <code>{snippet.code}</code>
          </pre>
          
          <div className="mt-3 pt-2 border-t border-glass-border flex justify-between items-center">
            <span className="text-[9px] font-mono text-muted italic">Lines: {snippet.code.split('\n').length}</span>
            <div className="text-[10px] font-mono text-accent hover:underline cursor-pointer uppercase tracking-tighter">
              view on github
            </div>
          </div>
        </div>
      </motion.div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export const CodeLab = () => {
  return (
    <section className="container mx-auto px-6 py-24 relative">
      <SectionHeader 
        title="The Code Lab" 
        subtitle="Exploring the building blocks of performant server-side logic." 
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CODE_SNIPPETS.map((s, i) => (
          <CodeCard key={i} snippet={s} />
        ))}
      </div>
    </section>
  );
};