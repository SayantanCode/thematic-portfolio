import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    // Raw HTML, sanitized server-side on save (shared/utils/sanitizeHtml.js)
    // and again client-side before render (defense-in-depth).
    content: { type: String, required: true },
    coverImage: { type: String, default: null },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    // Set once on the first publish (see post.service.js) — not touched on
    // unpublish, so republishing keeps the original date rather than
    // reading as a brand new post.
    publishedAt: { type: Date, default: null },

    // Denormalized counters, kept in sync with PostInteraction records
    // (postInteraction.model.js) on every view/like — reading these two
    // numbers is far more common than computing them from the interaction
    // collection on every request.
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const Post = mongoose.model("Post", postSchema);
