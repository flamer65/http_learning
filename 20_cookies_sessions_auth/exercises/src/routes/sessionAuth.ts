import { Router } from "express";
import { users, createUser, findUserByUsername, verifyPassword } from "../data/users";
import { sessionAuth } from "../middleware/sessionAuth";

const router = Router();

router.post("/register", async (req, res) => {
  // TODO: Create a user and return 201 { id, username }
  req.session?.userId ? res.status(400).json({ message: "Already logged in" }) : null;
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
  // TODO: Find user, verify password. If valid, set req.session.userId = user.id and return 200 { message: "Logged in" }
  // TODO: If invalid, return 401 { error: "Invalid credentials" }
  req.session?.userId ? res.status(400).json({ message: "Already logged in" }) : null;
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
  req.session.userId = user.id;
  res.status(200).json({ message: "Logged in" });
});

router.get("/profile", sessionAuth, (req, res) => {
  // TODO: Find user by req.session.userId and return their info (exclude password)
  const userId = req.session?.userId;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { username} = user;
  res.json({username });
});

router.post("/logout", (req, res) => {
  // TODO: Destroy session and clear cookie
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
});

export default router;

// Add type declaration for session
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
