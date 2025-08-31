import { ReactionType } from "@prisma/client";
import { z } from "zod";

const createCommentZodSchema = z.object({
  body: z.object({
    posId: z.string(),
    content: z.string(),
  }),
});

const createReplyZodSchema = z.object({
  body: z.object({
    posId: z.string(),
    commentId: z.string(),
    content: z.string(),
  }),
});

const updateCommentZodSchema = z.object({
  body: z.object({
    posId: z.string(),
    commentId: z.string(),
    content: z.string(),
  }),
});

const upsertReactionZodSchema = z.object({
  body: z.object({
    commentId: z.string(),
    reactionType: z.enum([ReactionType.Like, ReactionType.Dislike]),
  }),
});

export const CommentValidation = {
  createCommentZodSchema,
  createReplyZodSchema,
  updateCommentZodSchema,
  upsertReactionZodSchema,
};
