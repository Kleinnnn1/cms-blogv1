import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  content: z.string().min(1, "Content is required"),

  // excerpt: z.string().max(160, "Excerpt must be 160 characters or less"),

  coverImage: z.string().url("Must be a valid URL").nullable(),

  tags: z.array(z.string().min(1)),

  status: z.enum(["draft", "published"]),
});

export type PostFormValues = z.infer<typeof postSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
