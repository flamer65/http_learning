# 14 — Express.js Basics

## 📋 Overview

Build your first Express.js server! You'll learn how Express wraps `http.createServer`, use `app.get()` for routing, `res.json()` for responses, and master the critical pattern of separating `app.ts` from `server.ts` for testability.

This lesson builds directly on:
- **Lesson 13** (You built a raw server — now see how Express simplifies it)
- **Lesson 01** (HTTP request/response cycle, now with Express)
- **Lesson 04** (Status codes — you'll handle 404s properly)

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
Open `__tests__/app.test.ts` and read each test case carefully. Notice how **supertest** makes testing Express apps clean and simple — compare this to the raw `fetch()` approach in Lesson 13!

### 4. Implement (make them 🟢 GREEN)
Open `src/app.ts` and follow the TODO comments to implement each route.

### 5. Check your work
Run `bun test` after each change. Watch the tests go from red to green!

## 📝 Concepts Covered

| Concept | What You'll Do |
|---------|---------------|
| `express()` | Create an Express application |
| `app.get()` | Define a GET route handler |
| `res.json()` | Send JSON responses (auto-sets Content-Type!) |
| `res.status()` | Set HTTP status codes |
| `app.use()` | Add middleware (404 catch-all) |
| `process.uptime()` | Build a health check endpoint |
| App/Server separation | Export `app` from `app.ts`, listen in `server.ts` |
| supertest | Test Express apps without starting a real server |

## 📂 File Structure

```
exercises/
├── __tests__/
│   └── app.test.ts       ← Read these FIRST (10 test cases)
├── src/
│   ├── app.ts            ← Your Express app goes here
│   └── server.ts         ← Entry point (just calls listen)
├── solutions/
│   ├── app.ts            ← Reference solution
│   └── server.ts         ← Reference server
├── package.json
└── tsconfig.json
```

## 💡 Key Insight: Why Separate app.ts and server.ts?

```
app.ts                          server.ts
┌─────────────────────┐         ┌─────────────────────┐
│ Create app          │         │ Import app           │
│ Define routes       │────────▶│ Call app.listen()    │
│ Export app          │         │ (only entry point)   │
└─────────────────────┘         └─────────────────────┘
         │
         │ Tests import app directly
         ▼
┌─────────────────────┐
│ supertest(app)       │
│ No real server       │
│ needed for tests!    │
└─────────────────────┘
```

If you put `app.listen()` inside `app.ts`, it would start a real server every time you import it in a test — causing port conflicts and flaky tests.

## 🎯 When You're Done

All 10 tests should pass:
```bash
bun test
# ✓ 10 tests passed
```

**Try it out** — run the dev server and hit it with curl:
```bash
bun --watch src/server.ts

# In another terminal:
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/nonexistent
```

Then move on to the next lesson to learn about **middleware** — the real power of Express!
