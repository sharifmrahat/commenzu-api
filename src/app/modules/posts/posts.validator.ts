import { z } from "zod";

const createPostZodSchema = z.object({
  body: z.object({
    title: z.string(),
    thumbnail: z.string().optional(),
    content: z.string(),
  }),
});

export const PostValidation = {
  createPostZodSchema,
};
