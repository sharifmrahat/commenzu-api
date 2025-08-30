import express from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validator";
import { validateRequest } from "../../middlewares";

const router = express.Router();

router
  .route("/signup")
  .post(
    validateRequest(AuthValidation.signUpAuthZodSchema),
    AuthController.signup
  );
router
  .route("/login")
  .post(
    validateRequest(AuthValidation.loginAuthZodSchema),
    AuthController.login
  );

export const AuthRouter = router;
