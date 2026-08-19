import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["company", "npm", "product"]),
  priority: z.number().default(0),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  image: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  published: z.boolean().default(true),

  npmPackageName: z.string().optional().nullable(),
  npmDownloads: z.string().optional().nullable(),
  githubStars: z.number().optional().nullable(),

  company: z.string().optional().nullable(),
  companyUrl: z.string().optional().nullable(),
  role: z.string().optional().nullable(),

  learnings: z.string().optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();
