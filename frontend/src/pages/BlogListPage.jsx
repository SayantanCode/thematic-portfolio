import { useEffect, useState } from "react";
import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { BlogPostCard } from "@/features/blog/BlogPostCard.jsx";
import { postService } from "@/services/postService";

export const BlogListPage = () => {
  const [posts, setPosts] = useState(null); // null = loading

  useEffect(() => {
    let mounted = true;
    postService
      .listPublished()
      .then((result) => {
        if (mounted) setPosts(result.data);
      })
      .catch(() => {
        if (mounted) setPosts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-6 md:px-12 py-24 md:py-32 min-h-svh text-primary">
      <SectionHeader title="Blog" subtitle="Notes on backend architecture, real-time systems, and shipping." />

      {posts === null && <p className="text-muted text-sm">Loading...</p>}

      {posts?.length === 0 && (
        <p className="text-muted text-sm">Nothing published yet — check back soon.</p>
      )}

      {posts?.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, i) => (
            <BlogPostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};
