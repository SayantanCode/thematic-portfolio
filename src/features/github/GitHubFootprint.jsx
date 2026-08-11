import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Github, Star, GitBranch, ArrowUpRight } from "lucide-react";
import { GITHUB_STATS } from "../constants/GitHubStats.js";

const totalLangCount = GITHUB_STATS.languages.reduce((sum, l) => sum + l.count, 0);

export const GitHubFootprint = () => {
  return (
    <section className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="GitHub Footprint"
        subtitle="No client testimonials yet — here's the real, verifiable footprint instead."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 md:gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-glass-border flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
              <Github size={20} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              @SayantanCode
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-header font-black text-3xl text-primary">
                {GITHUB_STATS.repoCount}+
              </span>
              <p className="text-muted text-xs font-mono uppercase tracking-widest mt-1">
                Public Repos
              </p>
            </div>
            <div>
              <span className="font-header font-black text-3xl text-primary">
                {GITHUB_STATS.totalStars}
              </span>
              <p className="text-muted text-xs font-mono uppercase tracking-widest mt-1">
                Total Stars
              </p>
            </div>
          </div>

          {/* Language mix bar */}
          <div className="mb-2">
            <div className="flex w-full h-2 rounded-full overflow-hidden border border-glass-border">
              {GITHUB_STATS.languages.map((lang) => (
                <span
                  key={lang.name}
                  style={{ width: `${(lang.count / totalLangCount) * 100}%` }}
                  className="bg-accent first:opacity-100 [&:not(:first-child)]:bg-accent/40 [&:nth-child(3)]:bg-accent/20"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
            {GITHUB_STATS.languages.map((lang) => (
              <span key={lang.name} className="text-muted text-[10px] font-mono">
                {lang.name} · {lang.count}
              </span>
            ))}
          </div>

          <a
            href={GITHUB_STATS.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="interactive mt-auto inline-flex items-center justify-center gap-2 text-accent font-bold text-sm border-t border-glass-border pt-4 hover:text-accent/80 transition-colors"
          >
            View Full Profile <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {GITHUB_STATS.highlights.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="interactive glass-card rounded-xl p-5 border border-glass-border hover:border-accent/30 transition-colors flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-surface/50 border border-glass-border text-accent flex items-center justify-center shrink-0">
                <GitBranch size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-sm text-primary truncate">
                  {repo.name}
                </p>
                <p className="text-muted text-xs truncate">{repo.note}</p>
              </div>
              {repo.name === "express-unified-response" && (
                <span className="flex items-center gap-1 text-accent text-xs font-mono shrink-0">
                  <Star size={12} className="fill-accent" /> 5
                </span>
              )}
              <ArrowUpRight
                size={16}
                className="text-muted group-hover:text-accent transition-colors shrink-0"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
