import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, findUserByUsername, findUserById, verifyPassword } from "../data/users";
import { jwtAuth } from "../middleware/jwtAuth";

export const JWT_SECRET = "super-secret-key-for-learning";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await createUser(username, password);
  res.status(201).json({ id: user.id, username: user.username });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = findUserByUsername(username);
  if (!user || !(await verifyPassword(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

router.get("/profile", jwtAuth, (req, res) => {
  const user = findUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ id: user.id, username: user.username });
});

export default router;
