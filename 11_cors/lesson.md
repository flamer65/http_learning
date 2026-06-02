# 11 — CORS (Cross-Origin Resource Sharing)

## 🤔 Why Does This Exist?

Imagine you're at a bank. The bank teller will only accept requests from people **inside the bank**. If someone outside shouts through the window "transfer $1000 from Account A to Account B!" — the teller ignores it. That's basically what browsers do with the **Same-Origin Policy**.

But what if the bank has a **partner office** across the street that legitimately needs to make requests? The bank puts that partner on an **approved list**. That approved list mechanism? That's **CORS**.

> **Key Insight:** CORS is NOT a security wall — it's a **controlled door** in the wall that the Same-Origin Policy already built.

---

## 🌐 The Same-Origin Policy

### What Is an "Origin"?

An **origin** is defined by three parts:

```
Origin = Scheme + Host + Port

https://example.com:443
  │         │        │
  scheme    host     port
```

### Same Origin vs Different Origin

| URL A                         | URL B                           | Same Origin? | Why?                     |
|-------------------------------|---------------------------------|--------------|--------------------------|
| `https://example.com/page1`   | `https://example.com/page2`     | ✅ Yes       | Same scheme, host, port  |
| `https://example.com`         | `https://example.com:443`       | ✅ Yes       | 443 is default for HTTPS |
| `http://example.com`          | `https://example.com`           | ❌ No        | Different scheme         |
| `https://example.com`         | `https://api.example.com`       | ❌ No        | Different host           |
| `https://example.com:443`     | `https://example.com:8080`      | ❌ No        | Different port           |
| `https://example.com`         | `https://evil.com`              | ❌ No        | Different host           |

### What the Same-Origin Policy Blocks

When JavaScript on `https://frontend.com` tries to `fetch()` data from `https://api.backend.com`:

```
Browser (running JS from frontend.com)
    │
    │  fetch("https://api.backend.com/data")
    │
    ▼
🚫 BLOCKED by Same-Origin Policy!
   "You're from frontend.com, but you're trying
    to reach api.backend.com — that's a different origin!"
```

**What it blocks:**
- `fetch()` / `XMLHttpRequest` responses (the request IS sent, but JS can't read the response)
- Reading cookies from another origin
- Accessing the DOM of another origin's iframe

**What it does NOT block:**
- `<img src="https://other-origin.com/pic.jpg">` — images load fine
- `<script src="https://cdn.com/library.js">` — scripts load fine
- `<link href="https://fonts.com/style.css">` — CSS loads fine
- `<form action="https://other.com/submit">` — form submissions work

> **Crucial:** The Same-Origin Policy is a **browser** policy. `curl`, Postman, server-to-server calls — none of them care about origins. This is purely a browser security feature.

---

## 🔑 What Is CORS?

**CORS (Cross-Origin Resource Sharing)** is a mechanism that lets servers tell browsers:

> "It's OK — I allow requests from this other origin."

The server communicates this through **special HTTP headers**.

```
Browser (frontend.com)              Server (api.backend.com)
    │                                       │
    │  GET /data                            │
    │  Origin: https://frontend.com         │
    │  ─────────────────────────────────►   │
    │                                       │
    │  200 OK                               │
    │  Access-Control-Allow-Origin:         │
    │    https://frontend.com               │
    │  ◄─────────────────────────────────   │
    │                                       │
    ✅ Browser allows JS to read response
```

### When Does CORS Kick In?

| Scenario                                        | CORS Needed? |
|-------------------------------------------------|--------------|
| `fetch()` from browser JS to different origin   | ✅ Yes       |
| `XMLHttpRequest` to different origin            | ✅ Yes       |
| `curl` from terminal                            | ❌ No        |
| Server-to-server HTTP call (Node.js → API)      | ❌ No        |
| Postman request                                 | ❌ No        |
| `<img>`, `<script>`, `<link>` tags              | ❌ No        |
| `fetch()` to the **same** origin                | ❌ No        |

```bash
# curl doesn't care about CORS — this always works:
curl https://api.github.com/users/octocat

# But if you tried this from JavaScript on your-site.com,
# the browser would check for CORS headers first!
```

---

## 📋 Simple Requests vs Preflight Requests

Not all cross-origin requests are treated the same. Browsers classify them into two categories:

### Simple Requests (No Preflight)

A request is "simple" if it meets **ALL** of these conditions:

| Condition          | Allowed Values                                                                       |
|--------------------|--------------------------------------------------------------------------------------|
| **Method**         | `GET`, `POST`, or `HEAD`                                                             |
| **Headers**        | Only "safe" headers: `Accept`, `Accept-Language`, `Content-Language`, `Content-Type` |
| **Content-Type**   | Only: `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`       |

```
Simple Request Flow:
═══════════════════

Browser (frontend.com)              Server (api.backend.com)
    │                                       │
    │  GET /users                           │
    │  Origin: https://frontend.com         │
    │  ─────────────────────────────────►   │
    │                                       │
    │  200 OK                               │
    │  Access-Control-Allow-Origin:         │
    │    https://frontend.com               │
    │  {"users": [...]}                     │
    │  ◄─────────────────────────────────   │
    │                                       │
    ✅ One round trip. Done.
```

### Preflight Requests (Two Round Trips!)

Any request that **doesn't** qualify as "simple" triggers a **preflight**. Common triggers:

| Trigger                                  | Example                                    |
|------------------------------------------|--------------------------------------------|
| Non-simple method                        | `PUT`, `DELETE`, `PATCH`                   |
| Custom headers                           | `X-Custom-Header`, `Authorization`         |
| JSON content type                        | `Content-Type: application/json`           |

> **Yes — even a POST with `Content-Type: application/json` triggers a preflight!** This surprises many developers.

```
Preflight Request Flow:
═══════════════════════

Browser (frontend.com)              Server (api.backend.com)
    │                                       │
    │  ① PREFLIGHT (automatic)             |
    │  OPTIONS /users                       │
    │  Origin: https://frontend.com         │
    │  Access-Control-Request-Method: PUT   │
    │  Access-Control-Request-Headers:      │
    │    Content-Type, Authorization        │
    │  ─────────────────────────────────►   │
    │                                       │
    │  ② PREFLIGHT RESPONSE                 │
    │  204 No Content                       │
    │  Access-Control-Allow-Origin:         │
    │    https://frontend.com               │
    │  Access-Control-Allow-Methods:        │
    │    GET, POST, PUT, DELETE              │
    │  Access-Control-Allow-Headers:        │
    │    Content-Type, Authorization        │
    │  Access-Control-Max-Age: 86400        │
    │  ◄─────────────────────────────────   │
    │                                       │
    │  ③ ACTUAL REQUEST (now permitted)     │
    │  PUT /users/123                       │
    │  Origin: https://frontend.com         │
    │  Content-Type: application/json       │
    │  Authorization: Bearer token123       │
    │  {"name": "Naman"}                    │
    │  ─────────────────────────────────►   │
    │                                       │
    │  ④ ACTUAL RESPONSE                    │
    │  200 OK                               │
    │  Access-Control-Allow-Origin:         │
    │    https://frontend.com               │
    │  {"updated": true}                    │
    │  ◄─────────────────────────────────   │
    │                                       │
    ✅ Two round trips. Preflight + Actual.
```

**The browser does the preflight automatically.** You never write code to send an OPTIONS request — the browser inserts it for you.

---

## 📑 All CORS Headers Explained

### Request Headers (Sent by Browser)

| Header                             | Sent During       | Purpose                                          |
|------------------------------------|-------------------|--------------------------------------------------|
| `Origin`                           | All CORS requests | Tells server where the request came from          |
| `Access-Control-Request-Method`    | Preflight only    | "I want to use this HTTP method"                  |
| `Access-Control-Request-Headers`   | Preflight only    | "I want to send these custom headers"             |

### Response Headers (Sent by Server)

| Header                             | Purpose                                              | Example Value                          |
|------------------------------------|------------------------------------------------------|----------------------------------------|
| `Access-Control-Allow-Origin`      | Which origin(s) are allowed                          | `https://frontend.com` or `*`          |
| `Access-Control-Allow-Methods`     | Which HTTP methods are allowed                       | `GET, POST, PUT, DELETE`               |
| `Access-Control-Allow-Headers`     | Which custom headers the client can send             | `Content-Type, Authorization`          |
| `Access-Control-Allow-Credentials` | Whether cookies/auth can be sent                     | `true`                                 |
| `Access-Control-Expose-Headers`    | Which response headers JS can read                   | `X-Request-Id, X-RateLimit-Remaining` |
| `Access-Control-Max-Age`           | How long (seconds) to cache the preflight result     | `86400` (24 hours)                     |

### Deep Dive on Each Header

#### `Access-Control-Allow-Origin`

```
# Allow one specific origin:
Access-Control-Allow-Origin: https://frontend.com

# Allow ANY origin (public API):
Access-Control-Allow-Origin: *
```

⚠️ You can only specify **one** origin or `*` — NOT a comma-separated list! If you need to allow multiple origins, your server must **dynamically** check the `Origin` header and echo it back:

```
# Server logic (pseudocode):
allowed = ["https://app1.com", "https://app2.com"]
if request.headers["Origin"] in allowed:
    response.headers["Access-Control-Allow-Origin"] = request.headers["Origin"]
```

#### `Access-Control-Allow-Methods`

```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
```

Lists which HTTP methods the server accepts for cross-origin requests. Only checked during preflight.

#### `Access-Control-Allow-Headers`

```
Access-Control-Allow-Headers: Content-Type, Authorization, X-Custom-Header
```

Lists which non-"safe" headers the client is allowed to send. Only checked during preflight.

#### `Access-Control-Expose-Headers`

By default, JavaScript can only read these response headers:
- `Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`

To let JS read **other** headers:

```
Access-Control-Expose-Headers: X-Request-Id, X-RateLimit-Remaining
```

#### `Access-Control-Max-Age`

```
Access-Control-Max-Age: 86400
```

Tells the browser: "Cache this preflight result for 86400 seconds (24 hours). Don't send another OPTIONS request for this URL until then."

#### `Access-Control-Allow-Credentials`

```
Access-Control-Allow-Credentials: true
```

Required if the request includes cookies or HTTP auth. **This has a critical constraint** — see the next section.

---

## 🍪 Credentials & Cookies

By default, cross-origin `fetch()` does **NOT** send cookies. You must opt in on **both sides**:

### Client Side (JavaScript)

```javascript
// fetch API
fetch("https://api.backend.com/data", {
    credentials: "include"   // Send cookies with cross-origin request
});

// XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

### Server Side (Response Headers)

```
Access-Control-Allow-Origin: https://frontend.com    ← MUST be specific origin
Access-Control-Allow-Credentials: true               ← MUST be true
```

### ⚠️ The Wildcard + Credentials Rule

**This combination is FORBIDDEN:**

```
❌ Access-Control-Allow-Origin: *
❌ Access-Control-Allow-Credentials: true

→ Browser will REJECT this! You can't use * with credentials.
```

Why? If `*` worked with credentials, **any website** could make authenticated requests to your API using your users' cookies. That's a massive security hole.

```
✅ Correct — use a specific origin:
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Credentials: true
```

The same restriction applies to `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` — when credentials are involved, you cannot use `*` for those either. You must list specific values.

---

## 🧪 Try It Yourself — Simulating CORS with curl

`curl` doesn't enforce CORS, but we can **simulate** what the browser sends by including the `Origin` header manually. This lets us see how servers respond to CORS requests.

```bash
# ──────────────────────────────────────────────────
# 1. Simple CORS request — see if server allows it
# ──────────────────────────────────────────────────
curl -v -H "Origin: https://evil.com" \
  https://httpbin.org/get 2>&1 | grep -i "access-control"

# Look for: Access-Control-Allow-Origin in the response


# ──────────────────────────────────────────────────
# 2. Simulate a preflight (OPTIONS) request
# ──────────────────────────────────────────────────
curl -v -X OPTIONS \
  -H "Origin: https://frontend.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  https://httpbin.org/put 2>&1 | grep -i "access-control\|HTTP/"


# ──────────────────────────────────────────────────
# 3. Check CORS headers on real APIs
# ──────────────────────────────────────────────────
curl -sI -H "Origin: https://example.com" \
  https://api.github.com/users/octocat | grep -i "access-control"


# ──────────────────────────────────────────────────
# 4. Test with a POST + JSON Content-Type (triggers preflight)
# ──────────────────────────────────────────────────
# Step 1: Preflight
curl -v -X OPTIONS \
  -H "Origin: https://myapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://httpbin.org/post 2>&1 | grep -i "access-control"

# Step 2: Actual request
curl -v -X POST \
  -H "Origin: https://myapp.com" \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman"}' \
  https://httpbin.org/post 2>&1 | grep -i "access-control"


# ──────────────────────────────────────────────────
# 5. Compare: request WITHOUT Origin header
# ──────────────────────────────────────────────────
curl -sI https://httpbin.org/get | grep -i "access-control"
# Likely no CORS headers — server only sends them when it sees Origin
```

---

## 🚨 Common CORS Errors (And How to Fix Them)

### Error 1: "No 'Access-Control-Allow-Origin' header is present"

```
❌ Access to fetch at 'https://api.example.com/data' from origin
   'https://frontend.com' has been blocked by CORS policy:
   No 'Access-Control-Allow-Origin' header is present on the
   requested resource.
```

| Cause                                                  | Fix                                                          |
|--------------------------------------------------------|--------------------------------------------------------------|
| Server doesn't send CORS headers                       | Add `Access-Control-Allow-Origin` header on the server       |
| Server only allows certain origins and yours isn't one | Add your origin to the server's allow list                   |
| Proxy / Load Balancer strips the header                | Check your infra — make sure CORS headers pass through       |

### Error 2: "The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*'"

```
❌ Access to fetch at 'https://api.example.com/data' from origin
   'https://frontend.com' has been blocked by CORS policy:
   The value of 'Access-Control-Allow-Origin' must not be '*'
   when the request's credentials mode is 'include'.
```

| Cause                                    | Fix                                                         |
|------------------------------------------|-------------------------------------------------------------|
| Using `credentials: 'include'` with `*`  | Change `Access-Control-Allow-Origin` to the specific origin |

### Error 3: "Method PUT is not allowed by Access-Control-Allow-Methods"

```
❌ Access to fetch at 'https://api.example.com/users' from origin
   'https://frontend.com' has been blocked by CORS policy:
   Method PUT is not allowed by Access-Control-Allow-Methods in
   preflight response.
```

| Cause                                         | Fix                                              |
|-----------------------------------------------|--------------------------------------------------|
| Server doesn't list `PUT` in allowed methods  | Add `PUT` to `Access-Control-Allow-Methods`      |
| Server doesn't handle `OPTIONS` requests      | Add an OPTIONS handler / route on the server     |

### Error 4: "Request header field X-Custom-Header is not allowed"

```
❌ Access to fetch at 'https://api.example.com/data' from origin
   'https://frontend.com' has been blocked by CORS policy:
   Request header field x-custom-header is not allowed by
   Access-Control-Allow-Headers in preflight response.
```

| Cause                                               | Fix                                                   |
|-----------------------------------------------------|-------------------------------------------------------|
| Custom header not in `Access-Control-Allow-Headers` | Add the header name to `Access-Control-Allow-Headers` |

### Common Mistakes Summary Table

| Mistake                                          | What Happens                                | Fix                                             |
|--------------------------------------------------|---------------------------------------------|-------------------------------------------------|
| No CORS headers on server at all                 | All cross-origin JS requests fail           | Add CORS middleware/headers                     |
| Using `*` with `credentials: 'include'`          | Browser rejects the response                | Use specific origin, not `*`                    |
| Forgetting to handle `OPTIONS` method            | Preflight returns 404/405                   | Add OPTIONS route or use CORS middleware        |
| Not listing `Content-Type` in allowed headers    | POST with JSON triggers CORS error          | Add `Content-Type` to `Allow-Headers`           |
| Adding CORS headers only to the actual route     | Preflight fails (OPTIONS has no headers)    | Add CORS headers to OPTIONS responses too       |
| Setting CORS on backend but proxy strips headers | Headers never reach the browser             | Configure proxy to pass CORS headers through    |

---

## 🏗 CORS in System Design

### Where CORS Gets Handled

In production systems, CORS is typically NOT handled by each individual microservice. Instead, it's handled at the **edge**:

```
Browser (app.frontend.com)
    │
    ▼
┌─────────────────────────┐
│   API Gateway / Reverse │    ← CORS headers added HERE
│   Proxy (nginx, Kong,   │       Centralized CORS config
│   AWS API Gateway)      │
└─────────────────────────┘
    │
    ├──► Microservice A (no CORS logic needed)
    ├──► Microservice B (no CORS logic needed)
    └──► Microservice C (no CORS logic needed)
```

### Why Server-to-Server Calls Don't Have CORS

```
Microservice A ──────► Microservice B
    (Node.js)             (Python)

No browser = No Same-Origin Policy = No CORS!
```

CORS is **purely a browser security feature**. When your Node.js backend calls another API, there's no browser to enforce the Same-Origin Policy — so CORS headers are irrelevant.

### CDN Considerations

When your API responses are cached by a CDN, CORS gets tricky:

```
Problem:
1. User from app1.com requests /api/data
   → CDN caches response with: Access-Control-Allow-Origin: https://app1.com
2. User from app2.com requests /api/data
   → CDN serves cached response with: Access-Control-Allow-Origin: https://app1.com
   → ❌ CORS error for app2.com!
```

**Solution:** Use the `Vary` header:

```
Vary: Origin
```

This tells the CDN: "Cache separate versions of this response for each unique `Origin` header value."

### Common Architecture Patterns

| Pattern                             | How CORS Is Handled                                         |
|-------------------------------------|-------------------------------------------------------------|
| Single backend serves API + frontend | Same origin — no CORS needed                               |
| Separate frontend & API domains     | API Gateway adds CORS headers                              |
| Public API (open to all)            | `Access-Control-Allow-Origin: *`                            |
| Authenticated API + frontend        | Specific origin + `Allow-Credentials: true`                 |
| Multiple frontend apps              | Dynamic origin checking at API Gateway                      |
| Microservices (internal)            | No CORS — server-to-server calls bypass browser             |

---

## 📝 Key Takeaways

- **Same-Origin Policy** is the browser's default security — it blocks JS from reading cross-origin responses
- An **origin** = scheme + host + port. Even one difference = different origin
- **CORS** is the opt-in mechanism that relaxes the Same-Origin Policy via HTTP headers
- **Simple requests** (GET/POST/HEAD with safe headers) go directly — one round trip
- **Preflight requests** (PUT/DELETE/PATCH, custom headers, JSON) require an OPTIONS check first — two round trips
- The server controls CORS via `Access-Control-Allow-*` response headers
- **`*` wildcard cannot be used with credentials** — you must specify the exact origin
- `Access-Control-Max-Age` caches preflight results to avoid repeated OPTIONS requests
- `Access-Control-Expose-Headers` controls which response headers JS can read
- CORS is a **browser-only** concern — `curl`, Postman, and server-to-server calls are unaffected
- In production, handle CORS at the **API Gateway** level, not in individual microservices
- Use `Vary: Origin` when your responses are cached by a CDN

--- 

**← Previous:** [10 — Practical Project](../10_practical_project/lesson.md)
