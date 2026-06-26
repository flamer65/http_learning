# 14 — Express.js Basics

## 🤔 Why Express?

In [Lesson 13](../13_raw_http_server/lesson.md), you built an HTTP server from scratch with `node:http`. It worked, but you probably noticed some pain points:

- **Manual routing** with `if/else` chains gets messy fast
- **Parsing request bodies** from chunks is tedious boilerplate
- **Setting headers** like `Content-Type` for every response is repetitive
- **No middleware** — you'd have to build logging, error handling, etc. from scratch

**Express.js** solves all of this. It's a thin, unopinionated framework that wraps `http.createServer` and adds:

| Raw Node.js                              | Express.js |
|------------------------------------------|---------------------------------------------------------------------|
| `if (method === "GET" && path === "/")`  | `app.get("/", handler)`                                         |
| `res.writeHead(200, { "Content-Type": "application/json" })` | `res.json(data)` (auto-sets Content-Type!) 
| Manual body chunk collection             | Built-in `express.json()` middleware |
| No middleware concept                    | `app.use()` for composable middleware |

---

## 🧱 What Express Does Under the Hood

Express is **not** a new server — it's a wrapper around the same `http.createServer` you just learned:

```
┌─────────────────────────────────────────────────┐
│                  Your Route Handlers             │
│   app.get("/", (req, res) => { ... })           │
│   app.post("/data", (req, res) => { ... })      │
├─────────────────────────────────────────────────┤
│              Express.js Framework                │
│   • Router (pattern matching, params, etc.)      │
│   • Middleware pipeline                          │
│   • Enhanced req/res objects                     │
├─────────────────────────────────────────────────┤
│              node:http  createServer             │
├─────────────────────────────────────────────────┤
│              TCP / Operating System              │
└─────────────────────────────────────────────────┘
```

When you call `express()`, it returns a **function** that is compatible with `http.createServer`. In fact, this is roughly what `app.listen()` does internally:

```typescript
// This is essentially what app.listen(3000) does:
import http from "node:http";
const server = http.createServer(app);
server.listen(3000);
```

Knowing this makes Express feel less magical — it's just a fancy request handler!

---

## 🚀 Creating an Express App

```typescript
import express from "express";

const app = express();

// Parse JSON request bodies automatically
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

export { app };
```

### Key Differences from Raw Node.js

| Feature | Raw `http` | Express |
|---------|-----------|---------|
| Define a route | `if (method === "GET" && path === "/")` | `app.get("/", handler)` |
| Send JSON | `res.writeHead(200, {"Content-Type": "application/json"}); res.end(JSON.stringify(data))` | `res.json(data)` |
| Set status | `res.statusCode = 404` | `res.status(404)` |
| Read JSON body | Collect chunks + `JSON.parse()` | `express.json()` middleware + `req.body` |

---

## 📨 The Enhanced `req` and `res` Objects

Express wraps the raw `http.IncomingMessage` and `http.ServerResponse` with extra superpowers:

### Response Helpers

```typescript
// res.json() — sends JSON and auto-sets Content-Type
res.json({ message: "hello" });
// Equivalent to:
//   res.setHeader("Content-Type", "application/json");
//   res.end(JSON.stringify({ message: "hello" }));

// res.status() — sets status code (chainable!)
res.status(404).json({ error: "Not Found" });

// res.send() — smart response (auto-detects strings, objects, buffers)
res.send("Hello");              // Content-Type: text/html
res.send({ key: "value" });     // Content-Type: application/json
res.send(Buffer.from("data"));  // Content-Type: application/octet-stream
```

### Request Properties

Remember from [Lesson 02](../02_urls_and_uris/lesson.md) how URLs have paths and query strings? Express parses these for you:

```typescript
// For request: GET /users?role=admin
req.path          // "/users"
req.query         // { role: "admin" }  ← already parsed!
req.method        // "GET"
req.headers       // { host: "localhost:3000", ... }

// For request body (with express.json() middleware):
req.body          // the parsed JSON object
```

Compare this to Lesson 13 where you had to manually use `new URL()` and collect body chunks!

---

## 🔑 The Critical Pattern: Separating `app.ts` from `server.ts`

This is one of the **most important patterns** you'll learn in this curriculum. Here's why:

### ❌ The Problem: Everything in One File

```typescript
// ❌ BAD: Can't test without starting a real server
import express from "express";
const app = express();

app.get("/", (req, res) => res.json({ message: "hello" }));

app.listen(3000, () => console.log("Running on port 3000"));
// When you import this file in a test, it IMMEDIATELY starts listening!
```

### ✅ The Solution: Separate App from Server

```
exercises/
├── src/
│   ├── app.ts      ← Creates and configures the Express app, exports it
│   └── server.ts   ← Imports app, calls app.listen() — only entry point
```

**`app.ts`** — Define and export the app (no `.listen()` here):
```typescript
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express" });
});

export { app };
```

**`server.ts`** — Import and start listening:
```typescript
import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Why This Matters for Testing

In your test files, you import **only** `app.ts`:

```typescript
import request from "supertest";
import { app } from "../src/app";

// supertest handles starting/stopping the server for you!
const res = await request(app).get("/");
expect(res.status).toBe(200);
```

**supertest** wraps your Express app with a temporary server, makes the request, and cleans up — no port conflicts, no server management, no flakiness.

---

## 🛡️ Handling 404 (Not Found)

Remember from [Lesson 04](../04_status_codes/lesson.md), a `404` status means the resource was not found. In Express, if no route matches, the request falls through all your defined routes. You can catch this with a **catch-all middleware** at the bottom:

```typescript
// Define your routes first
app.get("/", (req, res) => { ... });
app.get("/health", (req, res) => { ... });

// Then catch everything else as 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
```

The order matters! Express processes middleware and routes **top-to-bottom**. The 404 handler must be **last**.

```
Request: GET /nonexistent
     │
     ▼
  app.get("/")         → No match, skip
     │
     ▼
  app.get("/health")   → No match, skip
     │
     ▼
  app.use(...)         → Catches everything! → 404
```

---

## 🏥 A Health Check Endpoint

A `/health` endpoint is a common pattern in production apps. Load balancers, container orchestrators (like Kubernetes), and monitoring tools hit this endpoint to check if your server is alive:

```typescript
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),   // seconds since the process started
  });
});
```

The `uptime` field tells you how long the server has been running — useful for detecting unexpected restarts.

---

## 🔄 Comparing Lesson 13 vs Lesson 14

Here's the same server implemented both ways:

### Raw `node:http` (Lesson 13)

```typescript
import http from "node:http";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});
```

### Express (Lesson 14)

```typescript
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
```

**4 lines vs 12 lines** — and it only gets more dramatic as your app grows!

---

## 📝 Key Takeaways

- Express wraps `http.createServer` — it's not magic, it's convenience
- `app.get()`, `app.post()`, etc. replace manual `if/else` routing
- `res.json()` auto-sets `Content-Type: application/json` and stringifies for you
- **Always separate `app.ts` (config) from `server.ts` (listen)** for testability
- Use a catch-all `app.use()` at the end for 404 handling
- **supertest** lets you test Express apps without starting a real server
- Express processes routes top-to-bottom — order matters!

---

**Next →** [15 — Middleware](../15_middleware/lesson.md)
