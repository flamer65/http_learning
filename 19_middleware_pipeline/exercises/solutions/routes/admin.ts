import { Router } from "express";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

export default router;
