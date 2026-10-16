import { Router } from "express";
import type { Request, Response } from "express";

export const rootRoutes: Router = Router();

rootRoutes.get("/health", (_req: Request, res: Response) => {
  return res.json({
    type: "success",
    message: "server health ok",
  });
});
