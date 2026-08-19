import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { postService } from "@/services/postService";
import { mediaService } from "@/services/mediaService";
import { Button } from "@/shared/ui/Button.jsx";
import { ImageUploadField } from "@/shared/ui/ImageUploadField.jsx";
import { sanitizeBlogHtml } from "@/shared/utils/sanitizeHtml.js";
import { ROUTES } from "@/routes/routeRegistry.js";

const EMPTY_POST = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  published: false,
};

const fieldClasses =
  "w-full rounded-sm border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent";

export const AdminBlogEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const imageInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_POST);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    postService
      .fetchByIdAdmin(id)
      .then((result) => {
        const post = result.data;
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || "",
          tags: (post.tags || []).join(", "),
          published: post.published,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  // Uploads to Cloudinary and splices an <img> tag in at the cursor —
  // the only practical way to drop an image into raw-HTML content without
  // leaving the page to go fetch a URL from Cloudinary's console.
  const handleInsertImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setInsertingImage(true);
    setError(null);
    try {
      const result = await mediaService.upload(file, "blog");
      const tag = `<img src="${result.data.url}" alt="" />`;
      const textarea = contentRef.current;
      const start = textarea?.selectionStart ?? form.content.length;
      const end = textarea?.selectionEnd ?? form.content.length;
      const nextContent = form.content.slice(0, start) + tag + form.content.slice(end);
      handleChange("content", nextContent);

      requestAnimationFrame(() => {
        textarea?.focus();
        const cursor = start + tag.length;
        textarea?.setSelectionRange(cursor, cursor);
      });
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setInsertingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published: form.published,
    };

    try {
      if (isEditing) {
        await postService.update(id, payload);
      } else {
        await postService.create(payload);
      }
      navigate(ROUTES.ADMIN_BLOG);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${form.title}"? This can't be undone.`)) return;
    try {
      await postService.remove(id);
      navigate(ROUTES.ADMIN_BLOG);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-sm text-text-muted">Loading...</p>;

  const previewHtml = sanitizeBlogHtml(form.content || "<p><em>Nothing to preview yet.</em></p>");
  const busy = saving || coverUploading || insertingImage;

  return (
    <div>
      <h1 className="text-lg font-black uppercase tracking-widest text-text mb-6">
        {isEditing ? "Edit Post" : "New Post"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-sm border border-glass-border p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={fieldClasses}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
              Slug (optional — auto-generated from title if blank)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className={fieldClasses}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Excerpt</label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              className={fieldClasses}
            />
          </div>

          <ImageUploadField
            label="Cover Image"
            value={form.coverImage}
            onChange={(url) => handleChange("coverImage", url)}
            folder="blog"
            onUploadingChange={setCoverUploading}
          />

          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className={fieldClasses}
            />
          </div>

          <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => handleChange("published", e.target.checked)}
            />
            Published
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs uppercase tracking-widest text-text-muted">
                Content (HTML)
              </label>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={insertingImage}
                className="interactive flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-accent"
              >
                <ImagePlus size={13} />
                {insertingImage ? "Uploading..." : "Insert Image"}
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleInsertImage}
                className="hidden"
              />
            </div>
            <textarea
              ref={contentRef}
              required
              rows={16}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className={`${fieldClasses} font-mono`}
              placeholder="<h2>Heading</h2>&#10;<p>Write your post as plain HTML. Wrap a <style> block scoped to your own selectors if you need custom CSS or media queries.</p>"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" size="sm" disabled={busy}>
              {saving ? "Saving..." : busy ? "Uploading image..." : "Save"}
            </Button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="interactive text-xs uppercase tracking-widest text-red-400 hover:opacity-80"
              >
                Delete Post
              </button>
            )}
          </div>
        </div>

        {/* Live preview — renders through the exact same sanitize + wrapper
            path as the public post page, so what you see here is what ships. */}
        <div className="glass-card rounded-sm border border-glass-border p-6 overflow-y-auto max-h-[80vh]">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-4">Preview</p>
          <h2 className="font-header font-black text-2xl text-text mb-4">{form.title || "Untitled"}</h2>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </form>
    </div>
  );
};
