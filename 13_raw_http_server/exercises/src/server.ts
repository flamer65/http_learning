/**
 * 🏗️ Lesson 13 — Raw HTTP Server
 *
 * Your task: Build an HTTP server using only Node's built-in `http` module.
 * No Express, no frameworks — just you and the raw request/response objects.
 *
 * Run the tests to see what you need to implement:
 *   bun test
 *
 * Run the server in dev mode:
 *   bun --watch src/server.ts
 */

import { resolve } from "node:dns";
import http from "node:http";

// ─── Helper: Read request body from chunks ──────────────────────
// TODO: Implement this function
// It should collect all data chunks from the request stream
// and return the full body as a string.
//
// Hint: req is a readable stream. Listen to "data" and "end" events.
// Return a Promise<string> so you can await it in your handler.
function readBody(req: http.IncomingMessage): Promise<string> {
  // TODO: Implement me!
  // 1. Create an array to hold chunks
  // 2. Listen for "data" events and push each chunk
  // 3. On "end", concatenate chunks and resolve
  // 4. On "error", reject
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// ─── Request Handler ────────────────────────────────────────────
// This is the function that handles every incoming request.
// It receives the raw req (IncomingMessage) and res (ServerResponse).
const handler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;
  const role = url.searchParams.get("role");
  console.log(role);
  // TODO: Parse the URL to get the pathname and query parameters
  // Hint: Use `new URL(req.url!, \`http://\${req.headers.host}\`)`
  // const url = ...
  // const pathname = ...
  res.setHeader("X-Powered-By", "raw-node");
  if (method === "GET" && path === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello" }));
  } else if (method === "GET" && path === `/users`) {
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ role: `${role}` }));
  } else if (method === "HEAD" && path === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end();
  } else if (method === "POST" && path === "/echo") {
    // handle POST...
    const body = await readBody(req);
    const parsed = JSON.parse(body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(parsed));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
  // TODO: Set the X-Powered-By header to "raw-node" on ALL responses
  // Hint: Use res.setHeader()

  // TODO: Implement routing based on req.method and pathname

  // ── GET / ──────────────────────────────────────────────────
  // TODO: Return 200 with JSON { message: "hello" }
  // Don't forget Content-Type: application/json!
  // Also handle HEAD / (same headers, but no body)

  // ── POST /echo ─────────────────────────────────────────────
  // TODO: Read the request body using the readBody helper
  // Parse it as JSON and send it back as the response

  // ── GET /users (with query params) ─────────────────────────
  // TODO: Extract the "role" query parameter
  // Return 200 with JSON { role: "<value>" }
  // Hint: url.searchParams.get("role")

  // ── 404 for everything else ────────────────────────────────
  // TODO: Return 404 with JSON { error: "Not Found" }

  // Remove this placeholder once you implement the routes:
};

// ─── Create and Export the Server ───────────────────────────────
const server = http.createServer(handler);

// Export the server so tests can start it on a random port
export { server };

// ─── Start the server (only when running directly) ─────────────
// When this file is imported by tests, we don't want to auto-listen.
// Only listen when running directly with `bun src/server.ts`
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const PORT = 3043;
  server.listen(PORT, () => {
    console.log(`🚀 Raw HTTP server running on http://localhost:${PORT}`);
  });
}
