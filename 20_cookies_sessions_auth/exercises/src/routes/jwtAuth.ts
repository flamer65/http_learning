import { Router } from "express";
import jwt from "jsonwebtoken";
import { users, createUser, findUserByUsername, verifyPassword } from "../data/users";
import { jwtAuth } from "../middleware/jwtAuth";

export const JWT_SECRET = "super-secret-key-for-learning";

const router = Router();

router.post("/register", async (req, res) => {
  // TODO: Create user and return 201 { id, username }
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }
  const user = await createUser(username, password);
  res.status(201).json({ id: user.id, username: user.username });
});

router.post("/login", async (req, res) => {
  // TODO: Find user, verify password. 
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const user = findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
    if (err || !token) {
      return res.status(500).json({ error: "Error generating token" });
    }
    res.status(200).json({ token });
  });
  // TODO: If valid, generate JWT using jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
  // TODO: Return 200 { token }
  // TODO: If invalid, return 401 { error: "Invalid credentials" }
});

router.get("/profile", jwtAuth, (req, res) => {
  const userId = req.user?.userId;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { username } = user;
  // TODO: Find user by req.user.userId and return info (exclude password)
  res.status(200).json({ username});
});

export default router;
