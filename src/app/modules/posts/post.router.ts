import express from "express";
import { PostController } from "./posts.controller";
import { validateRole } from "../../middlewares/role-validator";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares";
import { PostValidation } from "./posts.validator";

const router = express.Router();

router
  .route("/")
  .get(PostController.findAllPublishedPost)
  .post(
    validateRole(UserRole.User, UserRole.Moderator, UserRole.Admin),
    validateRequest(PostValidation.createPostZodSchema),
    PostController.insertPost
  );

router
  .route("/:id")
  .get(PostController.findOnePost)
  .post(
    validateRole(UserRole.Admin, UserRole.Moderator, UserRole.User),
    PostController.updatePostStatus
  )
  .patch(
    validateRole(UserRole.Admin, UserRole.Moderator),
    PostController.updateApprovalStatus
  )
  .delete(validateRole(UserRole.Admin), PostController.deletePost);

export const PostRouter = router;
