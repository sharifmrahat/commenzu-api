import { UserRole } from "@prisma/client";
import { catchAsync, generateSlugId, pick, responseData } from "../../../utils";
import { CommentService } from "./comments.service";

const insertComment = catchAsync(async (req, res) => {
  const postId = req.body.postId;
  const userId = req.user?.userId as string;
  const content = req.body.content;

  const result = await CommentService.insertComment(postId, userId, content);

  return responseData(
    { message: "Comment inserted successfully", result },
    res
  );
});

const insertReply = catchAsync(async (req, res) => {
  const postId = req.body.postId;
  const userId = req.user?.userId as string;
  const commentId = req.body.commentId;
  const content = req.body.content;

  const result = await CommentService.insertReply(
    postId,
    userId,
    commentId,
    content
  );

  return responseData({ message: "Reply added successfully", result }, res);
});

const editComment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.userId as string;
  const content = req.body?.content;

  const result = await CommentService.editComment(id, userId, content);

  return responseData({ message: "Comment updated successfully", result }, res);
});

const deleteComment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.userId as string;

  const result = await CommentService.deleteComment(id, userId);

  return responseData({ message: "Comment deleted successfully", result }, res);
});

const upsertReaction = catchAsync(async (req, res) => {
  const commentId = req.body.commentId;
  const reactionType = req.body.reactionType;
  const userId = req.user?.userId as string;

  const result = await CommentService.upsertReaction(
    commentId,
    userId,
    reactionType
  );

  return responseData(
    { message: "Reaction updated successfully", result },
    res
  );
});

const findAllComments = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);

  const filterOptions = pick(query, ["search", "postId"]);

  const result = await CommentService.findAllComments(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Comments retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const CommentController = {
  insertComment,
  insertReply,
  editComment,
  deleteComment,
  upsertReaction,
  findAllComments,
};
