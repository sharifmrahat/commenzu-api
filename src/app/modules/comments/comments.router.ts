import express from "express";
import { CommentController } from "./comments.controller";
import { validateRole } from "../../middlewares/role-validator";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares";
import { CommentValidation } from "./comments.validation";

const router = express.Router();

router
  .route("/")
  .get(
    validateRole(UserRole.User, UserRole.Moderator, UserRole.Admin),
    CommentController.findAllComments
  )
  .post(
    validateRole(UserRole.User, UserRole.Moderator, UserRole.Admin),
    validateRequest(CommentValidation.createCommentZodSchema),
    CommentController.insertComment
  );

router
  .route("/:id")
  .post(
    validateRole(UserRole.Admin, UserRole.Moderator, UserRole.User),
    validateRequest(CommentValidation.updateCommentZodSchema),
    CommentController.editComment
  )
  .delete(
    validateRole(UserRole.Admin, UserRole.Moderator, UserRole.User),
    CommentController.deleteComment
  );

router
  .route("/reply")
  .post(
    validateRole(UserRole.User, UserRole.Moderator, UserRole.Admin),
    validateRequest(CommentValidation.createReplyZodSchema),
    CommentController.insertReply
  );

router
  .route("/react")
  .post(
    validateRole(UserRole.User, UserRole.Moderator, UserRole.Admin),
    validateRequest(CommentValidation.upsertReactionZodSchema),
    CommentController.upsertReaction
  );

export const CommentRouter = router;
