/**
 * 🚀 Lesson 14 — Express Basics: Server Entry Point
 *
 * This file imports the app and starts listening.
 * It is NOT used in tests — tests import app.ts directly.
 *
 * Run with: bun --watch src/server.ts
 */

import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
