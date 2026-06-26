import { Router } from "express";
import { createUser, findUserByUsername, findUserById, verifyPassword } from "../data/users";
import { sessionAuth } from "../middleware/sessionAuth";

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
  
  req.session.userId = user.id;
  res.status(200).json({ message: "Logged in" });
});

router.get("/profile", sessionAuth, (req, res) => {
  const user = findUserById(req.session.userId!);
  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ id: user.id, username: user.username });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

export default router;

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
