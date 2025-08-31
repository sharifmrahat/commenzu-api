import httpStatus from "http-status";
import { ApiError, paginationHelper, prismaClient } from "../../../utils";
import { Prisma, ReactionType } from "@prisma/client";
import { CommentFilterOption } from "./comments.interface";
import { IPaginationOption } from "../../../interfaces/pagination";

const insertComment = async (
  postId: string,
  userId: string,
  content: string
) => {
  const data = {
    postId,
    userId,
    content,
    contentJson: "",
  };
  //TODO: Add rate limiting
  const createdComment = await prismaClient.comment.create({
    data: data,
  });

  return createdComment;
};

const insertReply = async (
  postId: string,
  userId: string,
  commentId: string,
  content: string
) => {
  //TODO: Add rate limiting

  const parentExists = await prismaClient.comment.findUnique({
    where: { id: commentId, isDeleted: false },
  });

  if (!parentExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not exists");
  }
  const data = {
    postId,
    userId,
    parentId: commentId,
    content,
    contentJson: "",
  };
  const createdReply = await prismaClient.comment.create({
    data: data,
  });

  return createdReply;
};

const editComment = async (id: string, userId: string, content: string) => {
  const commentExists = await prismaClient.comment.findUnique({
    where: { id: id, userId, isDeleted: false },
  });

  if (!commentExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not exists");
  }

  const createdComment = await prismaClient.comment.update({
    where: { id, userId },
    data: { content },
  });

  return createdComment;
};

const deleteComment = async (id: string, userId: string) => {
  const commentExists = await prismaClient.comment.findUnique({
    where: { id: id, userId, isDeleted: false },
  });

  if (!commentExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not exists");
  }

  const createdComment = await prismaClient.comment.update({
    where: { id, userId },
    data: { isDeleted: true },
  });

  return createdComment;
};

const upsertReaction = async (
  commentId: string,
  userId: string,
  reactionType: ReactionType
) => {
  return await prismaClient.$transaction(async (tx) => {
    const existingReaction = await tx.reaction.findFirst({
      where: { commentId, userId, isDeleted: false },
    });

    if (!existingReaction) {
      //* If No reaction yet → insert new
      await tx.reaction.create({
        data: { commentId, userId, type: reactionType },
      });

      return await tx.comment.update({
        where: { id: commentId },
        data:
          reactionType === "Like"
            ? { likesCount: { increment: 1 } }
            : { dislikesCount: { increment: 1 } },
      });
    }

    if (existingReaction.type === reactionType) {
      //* Toggle off (undo reaction)
      await tx.reaction.update({
        where: { id: existingReaction.id },
        data: { isDeleted: true },
      });

      return await tx.comment.update({
        where: { id: commentId },
        data:
          reactionType === "Like"
            ? { likesCount: { decrement: 1 } }
            : { dislikesCount: { decrement: 1 } },
      });
    }

    //* Switching reaction (Like to Dislike or Dislike to Like)
    await tx.reaction.update({
      where: { id: existingReaction.id },
      data: { type: reactionType },
    });

    return await tx.comment.update({
      where: { id: commentId },
      data: {
        likesCount: {
          increment: reactionType === "Like" ? 1 : -1,
        },
        dislikesCount: {
          increment: reactionType === "Dislike" ? 1 : -1,
        },
      },
    });
  });
};

const findAllComments = async (
  filterOptions: CommentFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["content", "contentJson"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.CommentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const comments = await prismaClient.comment.findMany({
    where: { ...whereCondition, isDeleted: false },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.comment.count({
    where: { ...whereCondition, isDeleted: false },
  });

  return {
    meta: {
      page,
      size: limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: comments,
  };
};

export const CommentService = {
  insertComment,
  insertReply,
  editComment,
  deleteComment,
  upsertReaction,
  findAllComments,
};
