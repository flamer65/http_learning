# 13 — Raw HTTP Server

## 📋 Overview

Build an HTTP server from scratch using Node's built-in `http` module — no frameworks! You'll manually handle routing, parse query strings, read request bodies from chunks, and set response headers.

This lesson connects directly to:
- **Lesson 01** (HTTP basics — you'll implement the request/response cycle)
- **Lesson 10** (You built a client, now build the server side)

## 🧪 TDD Workflow

### 1. Install dependencies
```bash
cd exercises
bun install
```

### 2. Run the tests (they should all FAIL — 🔴 RED)
```bash
bun test
```

### 3. Read the tests
Open `__tests__/server.test.ts` and read each test case carefully. The tests tell you **exactly** what your server needs to do.

### 4. Implement (make them 🟢 GREEN)
Open `src/server.ts` and follow the TODO comments to implement each handler.

### 5. Check your work
Run `bun test` after each change. Watch the tests go from red to green!

## 📝 Concepts Covered

| Concept | What You'll Do |
|---------|---------------|
| `http.createServer` | Create a server with a request handler |
| Request parsing | Read `req.method`, `req.url`, `req.headers` |
| URL parsing | Use `new URL()` to extract pathname and query params |
| Body reading | Collect chunks from the request stream |
| Response writing | `res.writeHead()`, `res.setHeader()`, `res.end()` |
| Manual routing | `if/else` on method + pathname |
| HEAD method | Return headers but no body |
| Custom headers | Set `X-Powered-By: raw-node` |
| 404 handling | Return proper error for unknown routes |

## 📂 File Structure

```
exercises/
├── __tests__/
│   └── server.test.ts    ← Read these FIRST (14 test cases)
├── src/
│   └── server.ts         ← Your implementation goes here
├── solutions/
│   └── server.ts         ← Reference solution (no peeking!)
├── package.json
└── tsconfig.json
```

## 💡 Hints

- The `URL` constructor needs a base URL: `new URL(req.url!, \`http://\${req.headers.host}\`)`
- Request body comes as chunks — use `req.on("data")` and `req.on("end")`
- Don't forget to call `res.end()` — otherwise the response hangs!
- For HEAD requests, send the same headers as GET but call `res.end()` with no arguments

## 🎯 When You're Done

All 14 tests should pass:
```bash
bun test
# ✓ 14 tests passed
```

Then move on to [Lesson 14 — Express Basics](../14_express_basics/) to see how Express simplifies everything you just built!
