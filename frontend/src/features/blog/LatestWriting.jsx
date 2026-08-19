import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { BlogPostCard } from "./BlogPostCard.jsx";
import { postService } from "@/services/postService";
import { ROUTES } from "@/routes/routeRegistry.js";

export const LatestWriting = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    postService
      .listPublished()
      .then((result) => {
        if (mounted) setPosts(result.data.slice(0, 3));
      })
      .catch(() => {
        // No backend yet, or nothing published — section just stays hidden.
      });
    return () => {
      mounted = false;
    };
  }, []);

  // No published posts yet — nothing worth showing on the homepage.
  if (posts.length === 0) return null;

  return (
    <section className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader title="Latest Writing" subtitle="Notes on backend architecture, real-time systems, and shipping." />
        <Link
          to={ROUTES.BLOG}
          className="interactive font-mono text-xs uppercase tracking-widest text-accent hover:gap-3 flex items-center gap-2 transition-all mb-12 md:mb-16"
        >
          View All Posts
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post, i) => (
          <BlogPostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  );
};
