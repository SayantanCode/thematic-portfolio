import { z } from "zod";

export const uploadFolderSchema = z.object({
  folder: z.enum(["projects", "blog"]),
});
