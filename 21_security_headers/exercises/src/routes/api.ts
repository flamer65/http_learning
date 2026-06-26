import { Router } from "express";
import { validateInput } from "../middleware/validate";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

router.post("/data", validateInput, (req, res) => {
  res.json({ success: true, data: req.body });
});

router.post("/search", validateInput, (req, res) => {
  res.json({ success: true, query: req.body.query });
});

export default router;
