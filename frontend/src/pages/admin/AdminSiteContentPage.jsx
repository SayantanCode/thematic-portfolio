import { useEffect, useState } from "react";
import { siteContentService } from "@/services/siteContentService";
import { Button } from "@/shared/ui/Button.jsx";
import {
  HERO_DEFAULTS,
  ABOUT_DEFAULTS,
  FOOTER_DEFAULTS,
} from "@/constants/siteContent.defaults.js";

const SECTIONS = [
  {
    key: "hero",
    title: "Hero",
    defaults: HERO_DEFAULTS,
    fields: [
      { name: "greeting", label: "Greeting" },
      { name: "firstName", label: "First Name" },
      { name: "lastName", label: "Last Name" },
      { name: "tagline", label: "Tagline" },
      { name: "bio", label: "Bio", multiline: true },
      { name: "availabilityBadge", label: "Availability Badge" },
      { name: "email", label: "Email" },
    ],
  },
  {
    key: "about",
    title: "About",
    defaults: ABOUT_DEFAULTS,
    fields: [
      { name: "sectionSubtitle", label: "Section Subtitle", multiline: true },
      { name: "roleTitle", label: "Role Title" },
      { name: "shortBio", label: "Short Bio", multiline: true },
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "company", label: "Company" },
      { name: "location", label: "Location" },
      { name: "since", label: "Since" },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    defaults: FOOTER_DEFAULTS,
    fields: [
      { name: "name", label: "Name" },
      { name: "blurb", label: "Blurb", multiline: true },
      { name: "availability", label: "Availability", multiline: true },
      { name: "email", label: "Email" },
      { name: "location", label: "Location" },
      { name: "githubUrl", label: "GitHub URL" },
      { name: "linkedinUrl", label: "LinkedIn URL" },
    ],
  },
];

const fieldClasses =
  "w-full rounded-sm border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent";

const SiteContentSection = ({ sectionKey, title, fields, defaults }) => {
  const [formData, setFormData] = useState(defaults);
  const [status, setStatus] = useState("idle"); // idle | saving | saved
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    siteContentService
      .fetchByKey(sectionKey)
      .then((result) => {
        if (mounted) setFormData({ ...defaults, ...result.data });
      })
      .catch(() => {
        // Not seeded yet — defaults already in state, nothing to do.
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  const handleChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      await siteContentService.updateByKey(sectionKey, formData);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSave} className="glass-card rounded-sm border border-glass-border p-6 mb-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-accent mb-4">{title}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.multiline ? "sm:col-span-2" : undefined}>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                value={formData[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={3}
                className={fieldClasses}
              />
            ) : (
              <input
                type="text"
                value={formData[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={fieldClasses}
              />
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

      <Button type="submit" size="sm" className="mt-4" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save"}
      </Button>
    </form>
  );
};

export const AdminSiteContentPage = () => (
  <div>
    <h1 className="text-lg font-black uppercase tracking-widest text-text mb-6">Site Content</h1>
    {SECTIONS.map((section) => (
      <SiteContentSection
        key={section.key}
        sectionKey={section.key}
        title={section.title}
        fields={section.fields}
        defaults={section.defaults}
      />
    ))}
  </div>
);
