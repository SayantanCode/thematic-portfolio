import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Eye } from "lucide-react";
import { CardContent } from "@/shared/ui/Card.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const BlogPostCard = ({ post, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
  >
    <Link
      to={`${ROUTES.BLOG}/${post.slug}`}
      className="interactive group glass-card rounded-2xl overflow-hidden border border-glass-border hover:border-accent/40 transition-colors duration-500 flex flex-col h-full"
    >
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        </div>
      )}

      <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-header font-bold text-lg text-primary">{post.title}</h3>
          <ArrowUpRight
            size={18}
            className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
          />
        </div>

        <div className="flex items-center gap-3 text-muted font-mono text-[10px] uppercase tracking-widest mb-3">
          <span>{formatDate(post.publishedAt)}</span>
          {post.views > 0 && (
            <span className="inline-flex items-center gap-1 normal-case">
              <Eye size={11} />
              {post.views}
            </span>
          )}
        </div>

        <p className="text-muted text-sm leading-relaxed flex-1">{post.excerpt}</p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-surface/50 border border-glass-border rounded-full text-[10px] font-mono text-accent/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Link>
  </motion.div>
);
