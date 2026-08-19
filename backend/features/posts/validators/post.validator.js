import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1).optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

// clientId is a random id the frontend generates once per browser
// (localStorage) — not real identity, just enough to dedupe views/likes
// from the same visitor. See postInteraction.model.js for the full reasoning.
export const clientIdSchema = z.object({
  clientId: z.string().min(10, "Invalid client id"),
});
