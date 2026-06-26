import { Router, Request, Response } from "express";

const router = Router();

router.get("/info", (req: Request, res: Response) => {
  res.json({ info: "Public information" });
});

export default router;
