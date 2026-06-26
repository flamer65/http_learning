/**
 * 🏗️ Lesson 14 — Express Basics: App Configuration
 *
 * Your task: Create an Express app with a few routes.
 * This file should ONLY define and export the app.
 * Do NOT call app.listen() here — that's in server.ts!
 *
 * Run the tests to see what you need to implement:
 *   bun test
 *
 * Run the server in dev mode:
 *   bun --watch src/server.ts
 */

import express from "express";

const app = express();

// TODO: Set up middleware to parse JSON request bodies
// Hint: app.use(express.json())
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({
       message: "Hello from Express"
    })
})
app.get("/health", (req, res) =>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    })
})
app.use((req, res) =>{
    res.status(404).json({error: "Not Found"})
})
// ─── Route: GET / ───────────────────────────────────────────────
// TODO: Return 200 with { message: "Hello from Express" }
// Hint: Use res.json() — it auto-sets Content-Type for you!

// ─── Route: GET /health ─────────────────────────────────────────
// TODO: Return 200 with { status: "ok", uptime: <number> }
// Hint: Use process.uptime() to get the server uptime in seconds

// ─── 404 Catch-All ──────────────────────────────────────────────
// TODO: Add a catch-all middleware at the END to handle unmatched routes
// It should return 404 with { error: "Not Found" }
// Hint: Use app.use() with a handler — no path needed.
// This must be AFTER all other route definitions!

// Export the app for testing (supertest will use this)
export { app };
