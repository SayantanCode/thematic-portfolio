import mongoose from "mongoose";

// One doc per (post, clientId, type) — existence of the doc IS the fact
// being recorded, so the unique index below both enforces and answers
// "has this visitor already viewed/liked this post".
//
// clientId is a random id the frontend generates once and persists in
// localStorage (frontend/src/shared/utils/clientId.js) — not real identity,
// just enough to stop trivial double-counting from the same browser. Routes
// also carry a per-IP rate limit (post.routes.js) against scripted abuse.
// This site has no reader accounts to hang stronger dedup off of, and
// device fingerprinting would be disproportionate for what's ultimately a
// vanity metric on a personal blog.
const postInteractionSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    clientId: { type: String, required: true },
    type: { type: String, required: true, enum: ["view", "like"] },
  },
  { timestamps: true, versionKey: false }
);

postInteractionSchema.index({ post: 1, clientId: 1, type: 1 }, { unique: true });

export const PostInteraction = mongoose.model("PostInteraction", postInteractionSchema);
