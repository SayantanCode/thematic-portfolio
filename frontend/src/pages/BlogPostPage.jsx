import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Heart, Share2, Check } from "lucide-react";
import { postService } from "@/services/postService";
import { sanitizeBlogHtml } from "@/shared/utils/sanitizeHtml.js";
import { ROUTES } from "@/routes/routeRegistry.js";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [state, setState] = useState({ post: null, notFound: false });
  const [liking, setLiking] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  // Persists across React StrictMode's dev-only double-invoke, so a post
  // only gets tracked as viewed once per real visit, not twice per mount.
  const trackedSlugRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setState({ post: null, notFound: false });
    postService
      .fetchBySlug(slug)
      .then((result) => {
        if (!mounted) return;
        setState({ post: result.data, notFound: false });
        if (trackedSlugRef.current !== slug) {
          trackedSlugRef.current = slug;
          postService.trackView(slug).catch(() => {});
        }
      })
      .catch(() => {
        if (mounted) setState({ post: null, notFound: true });
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleLike = async () => {
    if (!state.post || liking) return;
    const { likes, viewerHasLiked } = state.post;
    const optimisticLiked = !viewerHasLiked;
    setLiking(true);
    setState((prev) => ({
      ...prev,
      post: { ...prev.post, viewerHasLiked: optimisticLiked, likes: likes + (optimisticLiked ? 1 : -1) },
    }));

    try {
      const result = await postService.toggleLike(slug);
      setState((prev) => ({
        ...prev,
        post: { ...prev.post, viewerHasLiked: result.data.liked, likes: result.data.likes },
      }));
    } catch {
      setState((prev) => ({ ...prev, post: { ...prev.post, viewerHasLiked, likes } }));
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: state.post?.title, text: state.post?.excerpt, url });
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      // Clipboard blocked (permissions/insecure context) — no reasonable fallback.
    }
  };

  if (state.notFound) {
    return (
      <section className="container mx-auto px-6 md:px-12 py-32 min-h-svh text-center text-primary">
        <p className="text-muted mb-6">This post doesn't exist or isn't published.</p>
        <Link to={ROUTES.BLOG} className="interactive text-accent font-mono text-xs uppercase tracking-widest">
          &larr; Back to Blog
        </Link>
      </section>
    );
  }

  if (!state.post) {
    return (
      <section className="container mx-auto px-6 md:px-12 py-32 min-h-svh text-primary">
        <p className="text-muted text-sm">Loading...</p>
      </section>
    );
  }

  const { post } = state;

  return (
    <article className="container mx-auto px-6 md:px-12 py-24 md:py-32 max-w-3xl text-primary">
      <Link
        to={ROUTES.BLOG}
        className="interactive inline-flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-2xl border border-glass-border mb-8"
        />
      )}

      <h1 className="font-header font-black text-3xl md:text-5xl mb-4">{post.title}</h1>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-8">
        <p className="text-muted font-mono text-xs uppercase tracking-widest">
          {formatDate(post.publishedAt)}
        </p>

        <span className="inline-flex items-center gap-1.5 text-muted font-mono text-xs">
          <Eye size={14} />
          {post.views}
        </span>

        <button
          type="button"
          onClick={handleLike}
          className="interactive inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
        >
          <Heart
            size={14}
            className={post.viewerHasLiked ? "fill-accent text-accent" : "text-muted"}
          />
          <span className={post.viewerHasLiked ? "text-accent" : "text-muted"}>{post.likes}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="interactive inline-flex items-center gap-1.5 text-muted font-mono text-xs hover:text-accent transition-colors"
        >
          {shareCopied ? <Check size={14} className="text-accent" /> : <Share2 size={14} />}
          {shareCopied ? "Copied" : "Share"}
        </button>
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
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

      <div
        id={`post-${post.slug}`}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
      />
    </article>
  );
};
