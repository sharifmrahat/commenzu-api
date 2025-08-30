import express from "express";

const router = express.Router();

const routes = [{ path: "/auth", module: [] }];

routes.forEach((route) => {
  router.use(route.path, route.module);
});

export const AppRouter = router;
