/**
 * ✅ Lesson 14 — Solution: Server Entry Point
 *
 * Imports the app and starts listening on port 3000.
 */

import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});
