import mongoose from "mongoose";

// Flat schema with optional per-type fields rather than Mongoose
// discriminators — three types, a handful of type-specific fields each,
// discriminators would be ceremony without payoff here. The frontend just
// renders conditionally on `type`.
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["company", "npm", "product"] },
    // Ascending — lower shows first (and larger, as the "hero" slot).
    priority: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    image: { type: String, default: null },
    href: { type: String, default: null }, // null for "company" — no public link
    published: { type: Boolean, default: true },

    // type: "npm"
    npmPackageName: { type: String, default: null },
    npmDownloads: { type: String, default: null }, // free text, admin-curated (e.g. "85/month") — not live-fetched, see GITHUB_STATS precedent
    githubStars: { type: Number, default: null },

    // type: "company"
    company: { type: String, default: null },
    companyUrl: { type: String, default: null },
    role: { type: String, default: null },

    // type: "product" — the honest "what I'd improve" reframe
    learnings: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const Project = mongoose.model("Project", projectSchema);
