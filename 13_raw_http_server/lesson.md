# 13 — Raw HTTP Server with `node:http`

## 🤔 Why Start Without a Framework?

Before you reach for Express, Fastify, or any other framework, it's incredibly valuable to build an HTTP server **from scratch** using Node's built-in `http` module. Here's why:

1. **You'll truly understand the request/response cycle** — Remember from [Lesson 01](../01_what_is_http/lesson.md), every HTTP interaction is a request followed by a response. When you use `http.createServer`, you handle that cycle directly.
2. **Frameworks become "obvious"** — Once you've manually parsed URLs, read request bodies from chunks, and set headers by hand, you'll deeply appreciate what Express automates.
3. **Debugging becomes easier** — When something breaks in production, you need to understand what's happening at the `http` level, not just the Express level.

> In [Lesson 10](../10_practical_project/lesson.md), you built an HTTP **client** that made requests. Now you're flipping to the other side — building the **server** that receives and responds to those requests.

---

## 🧱 The `http.createServer` Foundation

```
┌──────────────────────────────────────────────────────┐
│                    Your Code                         │
│                                                      │
│   http.createServer((req, res) => {                  │
│     // req = IncomingMessage (what the client sent)  │
│     // res = ServerResponse  (what you send back)    │
│   })                                                 │
│                                                      │
├──────────────────────────────────────────────────────┤
│              Node.js  http  module                   │
├──────────────────────────────────────────────────────┤
│              TCP / Operating System                  │
└──────────────────────────────────────────────────────┘
```

The `http.createServer()` function takes a **request handler** — a callback that Node calls every time an HTTP request arrives. It receives two objects:

| Object | Type | What It Represents |
|--------|------|-------------------|
| `req` | `http.IncomingMessage` | The incoming request (method, URL, headers, body stream) |
| `res` | `http.ServerResponse` | Your outgoing response (set status, headers, write body) |

### Creating a basic server

```typescript
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---
 
## 📨 The Request Object (`req`)

Remember from [Lesson 01](../01_what_is_http/lesson.md), an HTTP request has:
- A **request line** (method + path + HTTP version)
- **Headers**
- An optional **body**

The `req` object gives you access to all of these:

```typescript
req.method    // "GET", "POST", "PUT", "DELETE", etc.
req.url       // "/users?role=admin" (path + query string)
req.headers   // { "content-type": "application/json", "host": "localhost:3000", ... }
```

### ⚠️ What `req` does NOT give you directly

- **Parsed URL path** — `req.url` includes the query string! You need to parse it yourself.
- **Parsed query parameters** — You must extract them from the URL.
- **Parsed body** — The body arrives as a **stream of chunks**, not a single string.

---

## 🔍 Manual URL and Query String Parsing

Remember from [Lesson 02](../02_urls_and_uris/lesson.md), a URL has structure:

```
http://localhost:3000/users?role=admin&active=true
                     ├────┤├──────────────────────┤
                     path   query string
```

Node's built-in `URL` class can parse this for you:

```typescript
const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);

parsedUrl.pathname           // "/users"
parsedUrl.searchParams       // URLSearchParams object
parsedUrl.searchParams.get("role")    // "admin"
parsedUrl.searchParams.get("active")  // "true"
```

You can also use the older `url.parse()` approach, but the `URL` constructor is the modern, standards-based way.

---

## 📦 Reading the Request Body

Remember from [Lesson 07](../07_request_response_body/lesson.md), POST and PUT requests carry data in the **body**. In raw Node.js, the body doesn't arrive all at once — it comes as a **stream of chunks**:

```
Client sends:  [chunk1][chunk2][chunk3] → end
```

You must collect the chunks and assemble them:

```typescript
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

// Usage inside your handler:
const body = await readBody(req);
const parsed = JSON.parse(body);  // if the body is JSON
```

### Why chunks?

HTTP doesn't require the body to arrive all at once. Large uploads (files, big JSON payloads) are streamed in pieces. This is memory-efficient — you don't need to buffer the entire body in RAM if you don't want to.

---

## 🚦 Manual Routing

Without a framework, **you** are the router. You check `req.method` and the parsed pathname to decide what to do:

```typescript
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  if (method === "GET" && path === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello" }));
  } else if (method === "POST" && path === "/data") {
    // handle POST...
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});
```

This is essentially a big `if/else` chain. It works, but you can already see why frameworks with dedicated routing (`app.get("/", handler)`) are popular!

---

## 🏷️ Setting Response Headers and Status

Remember from [Lesson 05](../05_headers/lesson.md), headers provide metadata about the response. In raw Node:

```typescript
// Option 1: writeHead (status + all headers at once)
res.writeHead(200, {
  "Content-Type": "application/json",
  "X-Powered-By": "raw-node",
  "X-Request-Id": "abc-123"
});

// Option 2: setHeader (one at a time, before writing)
res.statusCode = 200;
res.setHeader("Content-Type", "application/json");
res.setHeader("X-Powered-By", "raw-node");
```

### The HEAD Method

Remember from [Lesson 03](../03_http_methods/lesson.md), a `HEAD` request is identical to `GET` but the server **must not** send a body. You send back the same status and headers, but call `res.end()` without any data:

```typescript
if (method === "HEAD" && path === "/") {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "X-Powered-By": "raw-node"
  });
  res.end();  // No body!
}
```

---

## 🔄 Putting It All Together

Here's the full mental model of what happens when a request arrives:

```
Client Request
     │
     ▼
┌─────────────────────────────────────┐
│  1. Parse URL (pathname + query)    │
│  2. Check req.method                │
│  3. Route to correct handler        │
│  4. If POST/PUT: read body chunks   │
│  5. Set response status + headers   │
│  6. Write response body             │
│  7. Call res.end()                   │
└─────────────────────────────────────┘
     │
     ▼
Client Response
```

### ⚠️ Common Mistakes

1. **Forgetting `res.end()`** — The response hangs forever. The client never gets a reply.
2. **Writing after `res.end()`** — Throws an error ("write after end").
3. **Not setting Content-Type** — The client won't know how to interpret the body.
4. **Not handling unknown routes** — Requests to undefined paths will hang.

---

## 🧪 Testing Strategy

For this lesson, we're **not** using Express or supertest. Instead, we'll:

1. Start the server on a **random port** (port `0` tells the OS to pick one)
2. Use **`fetch()`** (built into Bun) to make requests
3. Assert on the response status, headers, and body
4. Shut the server down after tests

```typescript
beforeAll((done) => {
  server.listen(0, () => {
    const addr = server.address();
    baseUrl = `http://localhost:${(addr as any).port}`;
    done();
  });
});
```

This is the foundation that tools like supertest automate for you — you'll see that in the very next lesson!

---

## 📝 Key Takeaways

- `http.createServer()` gives you a raw request handler — the lowest level of HTTP in Node.js
- You must manually parse URLs, query strings, and request bodies
- Routing is just `if/else` on `req.method` and the parsed pathname
- Always call `res.end()` to complete the response
- Always set `Content-Type` so clients know what they're receiving
- The `HEAD` method returns headers but no body
- Understanding this layer makes frameworks like Express feel simple and logical

---

**Next →** [14 — Express Basics](../14_express_basics/lesson.md)
