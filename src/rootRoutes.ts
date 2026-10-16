import { Router } from "express";
import type { ErrorRequestHandler, Request, Response } from "express";

export const rootRoutes: Router = Router();

rootRoutes.get("/health", (_req: Request, res: Response) => {
  return res.json({
    type: "success",
    message: "server health ok",
  });
});

// Add application routes here
// rootRoutes.use("/users", userRoutes);
// rootRoutes.use("/auth", authRoutes);

// 404 fallback: runs for any request that matched no route above. Keep this
// router mounted last (after any future routers) so it sees every request.
rootRoutes.use((_req: Request, res: Response) => {
  res.status(404).json({
    type: "error",
    message: "Not found",
  });
});

// Central error handler: turns thrown errors and `next(error)` calls into
// JSON responses instead of Express's default HTML error page.
const handleError: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    type: "error",
    message: "Internal server error",
  });
};

rootRoutes.use(handleError);

// add routes from here
