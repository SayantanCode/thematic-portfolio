import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "@/services/postService";
import { Button } from "@/shared/ui/Button.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

export const AdminBlogListPage = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    postService
      .listAllAdmin()
      .then((result) => setPosts(result.data))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    try {
      await postService.remove(post._id);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-black uppercase tracking-widest text-text">Blog</h1>
        <Button asChild size="sm">
          <Link to={ROUTES.ADMIN_BLOG_NEW}>New Post</Link>
        </Button>
      </div>

      {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
      {posts === null && <p className="text-sm text-text-muted">Loading...</p>}
      {posts?.length === 0 && <p className="text-sm text-text-muted">No posts yet.</p>}

      {posts?.length > 0 && (
        <div className="glass-card rounded-sm border border-glass-border divide-y divide-glass-border">
          {posts.map((post) => (
            <div key={post._id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-accent/10 text-accent border border-accent/30"
                        : "bg-surface text-text-muted border border-glass-border"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
                <p className="text-sm font-bold text-text truncate">{post.title}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`${ROUTES.ADMIN_BLOG}/${post._id}/edit`}
                  className="interactive text-xs uppercase tracking-widest text-accent hover:opacity-80"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post)}
                  className="interactive text-xs uppercase tracking-widest text-red-400 hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
