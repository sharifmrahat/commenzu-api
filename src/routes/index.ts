import express from "express";
import { AuthRouter } from "../app/modules/auth/auth.router";

const router = express.Router();

const routes = [{ path: "/auth", module: AuthRouter }];

routes.forEach((route) => {
  router.use(route.path, route.module);
});

export const AppRouter = router;
