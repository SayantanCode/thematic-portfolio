import mongoose from "mongoose";

// One document per editable section. `key` is an enum (not free text) so a
// typo'd key from a future admin screen can't silently create an orphaned
// document nobody reads — extending to a new section is a one-line enum
// addition here, `data`'s shape is deliberately Mixed/untyped per key so
// each section's admin form owns its own fields without a schema migration.
const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: ["hero", "about", "footer"] },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
