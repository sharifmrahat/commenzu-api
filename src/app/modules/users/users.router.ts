import express from "express";
import { UserController } from "./users.controller";
import { validateRole } from "../../middlewares/role-validator";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares";
import { UserValidation } from "./users.validator";

const router = express.Router();

router
  .route("/")
  .get(validateRole(UserRole.Admin), UserController.findAllUsers);

router
  .route("/:id")
  .get(
    validateRole(UserRole.Admin, UserRole.Moderator),
    UserController.findOneUser
  )
  .delete(validateRole(UserRole.Admin), UserController.deleteUser);

router
  .route("/profile")
  .get(
    validateRole(UserRole.Admin, UserRole.Moderator, UserRole.User),
    UserController.getProfile
  )
  .patch(
    validateRole(UserRole.Admin, UserRole.Moderator, UserRole.User),
    validateRequest(UserValidation.updateProfileZodSchema),
    UserController.updateProfile
  );

export const UserRouter = router;
