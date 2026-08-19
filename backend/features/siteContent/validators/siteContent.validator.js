import { z } from "zod";

export const siteContentKeySchema = z.enum(["hero", "about", "footer"]);

// `data` is intentionally a loose record, not a per-field schema — each
// section's admin form owns its own fields; the backend just persists
// whatever shape it's given under a known key.
export const updateSiteContentSchema = z.object({
  data: z.record(z.string(), z.any()),
});
