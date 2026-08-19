import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "@/services/projectService";
import { Button } from "@/shared/ui/Button.jsx";
import { ImageUploadField } from "@/shared/ui/ImageUploadField.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

const EMPTY_PROJECT = {
  name: "",
  type: "product",
  priority: 0,
  description: "",
  tags: "",
  image: "",
  href: "",
  published: true,
  npmPackageName: "",
  npmDownloads: "",
  githubStars: "",
  company: "",
  companyUrl: "",
  role: "",
  learnings: "",
};

const fieldClasses =
  "w-full rounded-sm border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent";

export const AdminProjectEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_PROJECT);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    projectService
      .fetchByIdAdmin(id)
      .then((result) => {
        const p = result.data;
        setForm({
          name: p.name,
          type: p.type,
          priority: p.priority,
          description: p.description,
          tags: (p.tags || []).join(", "),
          image: p.image || "",
          href: p.href || "",
          published: p.published,
          npmPackageName: p.npmPackageName || "",
          npmDownloads: p.npmDownloads || "",
          githubStars: p.githubStars ?? "",
          company: p.company || "",
          companyUrl: p.companyUrl || "",
          role: p.role || "",
          learnings: p.learnings || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      type: form.type,
      priority: Number(form.priority) || 0,
      description: form.description,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: form.image || null,
      href: form.href || null,
      published: form.published,
      npmPackageName: form.npmPackageName || null,
      npmDownloads: form.npmDownloads || null,
      githubStars: form.githubStars === "" ? null : Number(form.githubStars),
      company: form.company || null,
      companyUrl: form.companyUrl || null,
      role: form.role || null,
      learnings: form.learnings || null,
    };

    try {
      if (isEditing) {
        await projectService.update(id, payload);
      } else {
        await projectService.create(payload);
      }
      navigate(ROUTES.ADMIN_PROJECTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${form.name}"? This can't be undone.`)) return;
    try {
      await projectService.remove(id);
      navigate(ROUTES.ADMIN_PROJECTS);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-sm text-text-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-lg font-black uppercase tracking-widest text-text mb-6">
        {isEditing ? "Edit Project" : "New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="glass-card rounded-sm border border-glass-border p-6 max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Name</label>
            <input type="text" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Type</label>
            <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className={fieldClasses}>
              <option value="company">Company (private, case-study modal)</option>
              <option value="npm">npm (published package)</option>
              <option value="product">Product (public repo/site)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Description</label>
          <textarea required rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} className={fieldClasses} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
              Priority (lower shows first / larger)
            </label>
            <input type="number" value={form.priority} onChange={(e) => handleChange("priority", e.target.value)} className={fieldClasses} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Image"
            value={form.image}
            onChange={(url) => handleChange("image", url)}
            folder="projects"
            onUploadingChange={setImageUploading}
          />
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
              Link (GitHub repo, live site — not used for "Company")
            </label>
            <input type="text" value={form.href} onChange={(e) => handleChange("href", e.target.value)} className={fieldClasses} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted">
          <input type="checkbox" checked={form.published} onChange={(e) => handleChange("published", e.target.checked)} />
          Published (visible on the site)
        </label>

        <hr className="border-glass-border" />
        <p className="text-xs uppercase tracking-widest text-accent">npm fields (type: npm)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">npm Package Name</label>
            <input type="text" value={form.npmPackageName} onChange={(e) => handleChange("npmPackageName", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Downloads (free text)</label>
            <input type="text" placeholder="e.g. 85/month" value={form.npmDownloads} onChange={(e) => handleChange("npmDownloads", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">GitHub Stars</label>
            <input type="number" value={form.githubStars} onChange={(e) => handleChange("githubStars", e.target.value)} className={fieldClasses} />
          </div>
        </div>

        <hr className="border-glass-border" />
        <p className="text-xs uppercase tracking-widest text-accent">Company fields (type: company)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Company</label>
            <input type="text" value={form.company} onChange={(e) => handleChange("company", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Company URL</label>
            <input type="text" value={form.companyUrl} onChange={(e) => handleChange("companyUrl", e.target.value)} className={fieldClasses} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">Your Role</label>
            <input type="text" value={form.role} onChange={(e) => handleChange("role", e.target.value)} className={fieldClasses} />
          </div>
        </div>

        <hr className="border-glass-border" />
        <p className="text-xs uppercase tracking-widest text-accent">Product fields (type: product)</p>
        <div>
          <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
            Learnings ("what I'd improve" — shown as a callout on the card)
          </label>
          <textarea rows={2} value={form.learnings} onChange={(e) => handleChange("learnings", e.target.value)} className={fieldClasses} />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <Button type="submit" size="sm" disabled={saving || imageUploading}>
            {saving ? "Saving..." : imageUploading ? "Uploading image..." : "Save"}
          </Button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="interactive text-xs uppercase tracking-widest text-red-400 hover:opacity-80"
            >
              Delete Project
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
