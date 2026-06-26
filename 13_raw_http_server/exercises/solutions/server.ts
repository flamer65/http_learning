/**
 * ✅ Lesson 13 — Solution: Raw HTTP Server
 *
 * Complete implementation of an HTTP server using Node's built-in http module.
 * This handles: GET /, POST /echo, GET /users?role=, HEAD /, and 404s.
 */

import http from "node:http";

// ─── Helper: Read request body from chunks ──────────────────────
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// ─── Request Handler ────────────────────────────────────────────
const handler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> => {
  // Parse the URL to extract pathname and query parameters
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Set custom header on ALL responses
  res.setHeader("X-Powered-By", "raw-node");

  // ── HEAD / ─────────────────────────────────────────────────
  // HEAD must return the same headers as GET but with no body.
  // We check HEAD before GET so we can handle it separately.
  if (method === "HEAD" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(); // No body for HEAD requests!
    return;
  }

  // ── GET / ──────────────────────────────────────────────────
  if (method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello" }));
    return;
  }

  // ── POST /echo ─────────────────────────────────────────────
  if (method === "POST" && pathname === "/echo") {
    const body = await readBody(req);
    const parsed = JSON.parse(body);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(parsed));
    return;
  }

  // ── GET /users (with query params) ─────────────────────────
  if (method === "GET" && pathname === "/users") {
    const role = url.searchParams.get("role");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ role }));
    return;
  }

  // ── 404 for everything else ────────────────────────────────
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
};

// ─── Create and Export the Server ───────────────────────────────
const server = http.createServer(handler);

export { server };

// ─── Start the server (only when running directly) ─────────────
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Raw HTTP server running on http://localhost:${PORT}`);
  });
}
