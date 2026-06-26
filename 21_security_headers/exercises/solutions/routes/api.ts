import { Router, Request, Response } from "express";

/**
 * 📡 API Routes — SOLUTION (same as starter — routes were already complete)
 */

export const apiRouter = Router();

apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

apiRouter.post("/data", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

apiRouter.post("/search", (req: Request, res: Response) => {
  const { query } = req.body;
  res.json({ results: [], query });
});
