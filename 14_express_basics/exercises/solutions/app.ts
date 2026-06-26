/**
 * ✅ Lesson 14 — Solution: Express App
 *
 * Complete implementation with all routes and 404 handling.
 */

import express from "express";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// ─── Route: GET / ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

// ─── Route: GET /health ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// ─── 404 Catch-All (must be LAST!) ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export { app };
