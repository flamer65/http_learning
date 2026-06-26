import { Router } from "express";
import { auth } from "../middleware/auth";
const router = Router();

// TODO: Apply auth middleware to all routes in this router
router.use("/admin", auth, router);
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

export default router;
