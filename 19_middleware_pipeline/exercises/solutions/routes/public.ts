import { Router } from "express";

const router = Router();

router.get("/info", (req, res) => {
  res.json({ info: "Public information" });
});

export default router;
