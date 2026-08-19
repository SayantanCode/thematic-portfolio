import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { mediaService } from "@/services/mediaService";

// Shared file-upload control for the two places the admin needs a
// Cloudinary-hosted image (project image, blog cover) — same pick -> upload
// -> preview -> clear flow either way, so it's built once here rather than
// duplicated across both editor pages.
export const ImageUploadField = ({ label, value, onChange, folder, onUploadingChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const result = await mediaService.upload(file, folder);
      onChange(result.data.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">{label}</label>

      {value ? (
        <div className="relative w-40 aspect-video rounded-sm overflow-hidden border border-glass-border group">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="interactive absolute top-1 right-1 p-1 rounded-full bg-bg/80 border border-glass-border opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="interactive flex flex-col items-center justify-center gap-1.5 w-40 aspect-video rounded-sm border border-dashed border-glass-border text-text-muted text-xs"
        >
          <UploadCloud size={16} />
          {uploading ? "Uploading..." : "Upload image"}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="interactive mt-2 block text-xs text-accent"
        >
          {uploading ? "Uploading..." : "Replace image"}
        </button>
      )}

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};
