# ⚡ Chapter 12: HTTP Caching — The Art of Not Doing Work Twice

Imagine you're a librarian. Every day, the same student walks in and asks for the same book. You could walk to the back shelves, find it, carry it back, and hand it over — *every single time*. Or you could just keep a copy at the front desk and say, "Here, I already have it ready for you."

That's HTTP caching in a nutshell: **remembering responses so you don't have to fetch them again.**

It sounds simple, but caching is one of the most powerful — and most misunderstood — parts of HTTP. Get it right, and your website feels instant. Get it wrong, and users see stale data, broken pages, or worse — someone else's private information.

> *"There are only two hard things in Computer Science: cache invalidation and naming things."* — Phil Karlton

Let's master the first one.

---

## 📊 Why Caching Matters — The Numbers Don't Lie

Before we dive into headers and directives, let's see *why* caching is worth obsessing over:

| Metric                  | Without Caching       | With Caching           | Improvement     |
|-------------------------|-----------------------|------------------------|-----------------|
| Page Load Time          | 3.2 seconds           | 0.8 seconds            | **75% faster**  |
| Bandwidth per visit     | 2.5 MB                | 0.3 MB                 | **88% saved**   |
| Server requests/page    | 45 requests           | 8 requests             | **82% fewer**   |
| Server CPU cost/month   | $500                  | $120                   | **76% cheaper** |
| CDN data transfer       | 10 TB/month           | 2 TB/month             | **80% saved**   |

Caching helps in **three fundamental ways:**

1. **⚡ Performance** — Cached responses are served instantly from memory or disk. No network round-trip, no server processing.
2. **📉 Bandwidth Savings** — Fewer bytes over the wire means faster loads on slow connections and lower hosting bills.
3. **🏋️ Server Load Reduction** — Your servers handle fewer requests, so they can serve more users with the same hardware.

A well-cached website can handle **10x the traffic** without adding a single server.

---

## 🗺️ Where Caching Happens — The Cache Layers

Caching doesn't happen in just one place. There are multiple layers between the user and your origin server, and each can cache responses:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      THE CACHING LAYER CAKE                          │
│                                                                      │
│   👤 User clicks a link                                              | 
│    │                                                                 │
│    ▼                                                                 │
│   ┌─────────────────────┐                                            │
│   │  1. BROWSER CACHE   │  Closest to user. Fastest.                 │
│   │  (Private Cache)    │  Stores responses on disk/memory.          │
│   │                     │  Only this user's data.                    │
│   └────────┬────────────┘                                            │
│            │ Cache MISS                                              │
│            ▼                                                         │
│   ┌─────────────────────┐                                            │
│   │  2. PROXY CACHE     │  Corporate/ISP proxy.                      │
│   │  (Shared Cache)     │  Shared across multiple users.             │
│   │                     │  Less common today (HTTPS killed it).      │
│   └────────┬────────────┘                                            │
│            │ Cache MISS                                              │
│            ▼                                                         │
│   ┌─────────────────────┐                                            │
│   │  3. CDN CACHE       │  Cloudflare, AWS CloudFront, Akamai.       │
│   │  (Shared Cache)     │  Edge servers worldwide.                   │
│   │                     │  Closest server geographically.            │
│   └────────┬────────────┘                                            │
│            │ Cache MISS                                              │
│            ▼                                                         │
│   ┌─────────────────────┐                                            │
│   │  4. SERVER CACHE    │  Redis, Memcached, Varnish.                │
│   │  (Application Cache)│  Caches DB queries, rendered pages.        │
│   │                     │  Not HTTP caching per se, but crucial.     │
│   └────────┬────────────┘                                            │
│            │ Cache MISS                                              │
│            ▼                                                         │
│   ┌─────────────────────┐                                            │
│   │  5. ORIGIN SERVER   │  The actual web server.                    │
│   │  (Source of Truth)  │  Generates the response fresh.             │
│   │                     │  Hits the database, renders HTML, etc.     │
│   └─────────────────────┘                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Layer Details:

| Layer               | Type        | Scope       | Speed                      |Example                     |
|---------------------|-------------|-------------|----------------------------|----------------------------|
| **Browser Cache**   | Private     | Single user | ~0ms (memory), ~5ms (disk) | Chrome's disk cache        |
| **Proxy Cache**     | Shared      | Network/org | ~10-50ms                   | Corporate proxy, ISP cache |
| **CDN Cache**       | Shared      | Global      | ~20-100ms                  | Cloudflare, CloudFront     |
| **Server Cache**    | Application | Server-side | ~1-5ms                     | Redis, Memcached, Varnish  |
| **Origin Server**   | N/A         | N/A         | ~100-500ms+                | Your Express/Django app    |

> **Key Insight:** `private` vs `public` in `Cache-Control` determines whether shared caches (proxy/CDN) are *allowed* to store the response. A browser cache is always a private cache.

Let's see real cache layers in action:

```bash
# Check what cache layer served a response from Cloudflare
curl -s -D - https://www.cloudflare.com/ -o /dev/null 2>&1 | grep -i 'cf-cache-status\|cache-control\|age'
```

The `cf-cache-status` header tells you:
- `HIT` — Served from CDN cache
- `MISS` — Fetched from origin, now cached
- `EXPIRED` — Was cached but expired, re-fetched
- `BYPASS` — CDN was told not to cache this

---

## 🎛️ Cache-Control Header — The Deep Dive

The `Cache-Control` header is the **primary mechanism** for controlling caching in HTTP/1.1. It replaces the older `Expires` header and gives you fine-grained control over who caches what, for how long, and under what conditions.

```
Cache-Control: public, max-age=3600, must-revalidate
              ──────  ────────────  ────────────────
              WHO       HOW LONG      WHAT THEN?
```

### Every Directive Explained

---

### 1️⃣ `max-age=N` — Cache for N Seconds

The most common directive. Tells the browser (and CDN): "This response is good for N seconds. Don't ask me again until it expires."

```
Cache-Control: max-age=3600    ← Cache for 1 hour (3600 seconds)
Cache-Control: max-age=86400   ← Cache for 1 day
Cache-Control: max-age=604800  ← Cache for 1 week
Cache-Control: max-age=31536000 ← Cache for 1 year (the practical max)
```

```bash
# See max-age on a real CDN-hosted asset
curl -sI https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js | grep -i cache-control
```

Once cached, the browser won't even *send* a request to the server until `max-age` expires. This is called a **"fresh"** response — it's served directly from cache with zero network activity.

---

### 2️⃣ `s-maxage=N` — Shared Cache (CDN) Override

Like `max-age`, but **only applies to shared caches** (CDNs, proxies). The browser ignores it.

```
Cache-Control: max-age=60, s-maxage=3600
```

This means:
- **Browser:** Cache for 60 seconds
- **CDN:** Cache for 3600 seconds (1 hour)

Why? Your CDN can serve a slightly stale version to millions of users, but each individual user should check back sooner for personalized touches.

---

### 3️⃣ `no-cache` — ⚠️ NOT "Don't Cache"!

This is the **most misunderstood directive** in all of HTTP.

`no-cache` does **NOT** mean "don't cache." It means:

> "You CAN cache this, but you MUST check with the server (revalidate) before every use."

```
Cache-Control: no-cache
```

The flow:
```
Browser: "I have a cached copy. Is it still good?"
         → Sends If-None-Match: "abc123" (the ETag)
Server:  "Yep, still good."
         ← 304 Not Modified (no body — saves bandwidth!)

   OR

Server:  "Nope, here's the new version."
         ← 200 OK + new body
```

**Think of it as "always revalidate."** The response IS stored in the cache, but it's never used without first asking the server.

---

### 4️⃣ `no-store` — Truly Don't Cache

THIS is the "don't cache" directive. It means:

> "Do NOT store this response anywhere. Not in the browser cache, not in the CDN, not on disk. Forget you ever saw it."

```
Cache-Control: no-store
```

Use this for:
- Banking transactions
- Medical records
- One-time passwords
- Any sensitive data that shouldn't linger on disk

```bash
# Bank websites use no-store for authenticated pages
curl -sI https://httpbin.org/response-headers?Cache-Control=no-store | grep -i cache-control
```

---

### 5️⃣ `public` vs `private` — Who Can Cache?

```
Cache-Control: public, max-age=3600
```
**`public`** → "Any cache can store this." Browser, CDN, proxy — everyone.

```
Cache-Control: private, max-age=3600
```
**`private`** → "Only the browser can cache this." CDNs and proxies must NOT store it.

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│   public:   Browser ✅   CDN ✅   Proxy ✅          │
│   private:  Browser ✅   CDN ❌   Proxy ❌          │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**When to use `private`:**
- User-specific data (profile page, dashboard)
- Responses that vary by authentication
- Anything with a `Set-Cookie` header

**When to use `public`:**
- Static assets (images, JS, CSS)
- Public API responses
- Anything that's the same for all users

---

### 6️⃣ `must-revalidate` — No Stale Serving After Expiry

Normally, when a cached response expires, the browser *might* still use the stale version briefly (especially if the network is down). `must-revalidate` says:

> "Once the `max-age` expires, you MUST revalidate. Do NOT serve a stale copy. If you can't reach the server, return a 504 Gateway Timeout."

```
Cache-Control: max-age=3600, must-revalidate
```

This is critical for content where showing outdated data is worse than showing an error — like financial data or inventory counts.

---

### 7️⃣ `immutable` — Never Revalidate

The opposite philosophy of `must-revalidate`. Used for **versioned assets** (files with a hash in the filename):

```
Cache-Control: max-age=31536000, immutable
```

This tells the browser: "This resource will NEVER change. Don't even bother revalidating when the user hits Reload."

Without `immutable`, even with a long `max-age`, browsers still revalidate on manual reload (Ctrl+R). The `immutable` directive eliminates even those checks.

**Only use this for files with content hashes in the name:**
```
app.3a7b9c2e.js     ← Content changes? New filename. immutable ✅
styles.min.css      ← Same filename, content might change. immutable ❌
```

---

### 8️⃣ `stale-while-revalidate=N` — Best of Both Worlds

A modern directive that says: "After `max-age` expires, serve the stale version immediately BUT also fetch a fresh one in the background."

```
Cache-Control: max-age=60, stale-while-revalidate=30
```

Timeline:
```
0s ─────────── 60s ──────────── 90s ────────────→
│   FRESH        │   STALE-OK      │   MUST REVALIDATE
│   Serve from   │   Serve stale   │   Must wait for
│   cache. No    │   immediately,  │   server response
│   request.     │   fetch new in  │   before serving.
│                │   background.   │
```

This gives users **instant responses** while keeping the cache up-to-date. It's the pattern behind many modern web apps.

---

### 📋 Complete Cache-Control Reference Table

| Directive                    | Applies To         | Meaning             | Example Use Case |
|------------------------------|--------------------|---------------------|-----------------|
| `max-age=N`                  | All caches         | Cache for N seconds | `max-age=3600` for static assets |
| `s-maxage=N`                 | Shared caches only | Override max-age for CDNs | `s-maxage=86400` for CDN caching |
| `no-cache`                   | All caches         | Cache, but always revalidate first | HTML pages that might change |
| `no-store`                   | All caches         | Don't cache at all | Banking, medical data |
| `public`                     | Shared caches      | Allow CDN/proxy caching | Public images, scripts |
| `private`                    | Browser only       | Disallow CDN/proxy caching | User dashboards, profiles |
| `must-revalidate`            | All caches         | Don't serve stale after expiry | Financial data, inventory |
| `immutable`                  | All caches         | Never revalidate, even on reload | Versioned assets (`app.abc.js`) |
| `stale-while-revalidate=N`   | All caches         | Serve stale for N secs while refreshing | API responses, news feeds |
| `stale-if-error=N`           | All caches         | Serve stale for N secs if server errors | High-availability content |
| `no-transform`               | Proxies            | Don't modify the response body | Prevent proxy compression |
| `proxy-revalidate`           | Shared caches      | Like must-revalidate, but for proxies only | CDN-specific revalidation |

---

## 🔄 Validation — Conditional Requests (304 Not Modified)

When a cached response expires (or uses `no-cache`), the browser doesn't just throw it away and re-download. Instead, it **asks the server if the cached version is still valid.** This is called a **conditional request.**

There are two mechanisms:

### Mechanism 1: ETag + `If-None-Match` (Content Hash)

An **ETag** (Entity Tag) is a fingerprint of the response content. If the content hasn't changed, the fingerprint stays the same.

```
FIRST REQUEST:
──────────────
Browser → Server:  GET /api/products

Server → Browser:  200 OK
                   ETag: "a1b2c3d4"
                   Cache-Control: no-cache
                   Body: [{"id": 1, "name": "Widget"}, ...]

LATER REQUEST (revalidation):
─────────────────────────────
Browser → Server:  GET /api/products
                   If-None-Match: "a1b2c3d4"

Server checks: Is the ETag still "a1b2c3d4"?

  YES → Server: 304 Not Modified      (no body! saves bandwidth)
                ETag: "a1b2c3d4"

  NO →  Server: 200 OK                (new body, new ETag)
                ETag: "e5f6g7h8"
                Body: [{"id": 1, "name": "New Widget"}, ...]
```

```bash
# See ETag in action on httpbin
curl -sI https://httpbin.org/etag/my-custom-etag | grep -i etag

# Now send a conditional request with If-None-Match
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "If-None-Match: \"my-custom-etag\"" \
  https://httpbin.org/etag/my-custom-etag

# Try with a WRONG ETag — you'll get 200 instead of 304
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "If-None-Match: \"wrong-etag\"" \
  https://httpbin.org/etag/my-custom-etag
```

**ETag Types:**
- **Strong ETag:** `"a1b2c3d4"` — Byte-for-byte identical
- **Weak ETag:** `W/"a1b2c3d4"` — Semantically equivalent (content meaning is the same, formatting might differ)

---

### Mechanism 2: `Last-Modified` + `If-Modified-Since` (Timestamp)

A simpler, older mechanism. The server sends the last modification time, and the browser asks "has it changed since then?"

```
FIRST REQUEST:
──────────────
Browser → Server:  GET /images/logo.png

Server → Browser:  200 OK
                   Last-Modified: Tue, 15 Oct 2024 10:30:00 GMT
                   Body: <image data>

LATER REQUEST (revalidation):
─────────────────────────────
Browser → Server:  GET /images/logo.png
                   If-Modified-Since: Tue, 15 Oct 2024 10:30:00 GMT

Server checks: Was it modified after Oct 15, 2024 10:30?

  NO →  Server: 304 Not Modified (no body!)
  YES → Server: 200 OK + new body
```

```bash
# See Last-Modified on a real resource
curl -sI https://httpbin.org/cache | grep -i 'last-modified\|etag\|cache-control'

# Send a conditional request using If-Modified-Since
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "If-Modified-Since: Wed, 01 Jan 2030 00:00:00 GMT" \
  https://httpbin.org/cache
# Future date → not modified since → should return 304

curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "If-Modified-Since: Wed, 01 Jan 2020 00:00:00 GMT" \
  https://httpbin.org/cache
# Past date → has been modified since → should return 200
```

### ETag vs Last-Modified — Which Is Better?

| Feature | ETag | Last-Modified |
|---------|------|---------------|
| Precision | Exact content match | 1-second resolution |
| Handles sub-second changes | ✅ Yes | ❌ No |
| Works with load balancers | ⚠️ Must be consistent | ✅ Usually fine |
| Server overhead | Must compute hash | Just check file time |
| Recommendation | **Preferred** | Good fallback |

> **Best Practice:** Use both! The server sends both `ETag` and `Last-Modified`. The browser sends both `If-None-Match` and `If-Modified-Since`. The server checks ETag first (it's more precise).

---

### The Complete Validation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    CACHE VALIDATION FLOW                       │
│                                                                │
│  Browser has cached response. Is it still fresh?               │
│                                                                │
│            ┌─────────────────┐                                 │
│            │ Is max-age      │                                 │
│            │ expired?        │                                 │
│            └───────┬─────────┘                                 │
│              NO    │    YES                                    │
│              │     │                                           │
│              ▼     ▼                                           │
│      ┌───────────┐ ┌────────────────────────┐                  │
│      │ Serve     │ │ Has ETag or            │                  │
│      │ from      │ │ Last-Modified?         │                  │
│      │ cache     │ └──────────┬─────────────┘                  │
│      │ directly! │    NO      │     YES                        │
│      │ (fastest) │    │       │                                │
│      └───────────┘    │       ▼                                │
│                       │  ┌──────────────────┐                  │
│                       │  │ Send conditional │                  │
│                       │  │ request with     │                  │
│                       │  │ If-None-Match /  │                  │
│                       │  │ If-Modified-Since│                  │
│                       │  └────────┬─────────┘                  │
│                       │           │                            │
│                       │     ┌─────┴──────┐                     │
│                       │     │            │                     │
│                       │  304 Not      200 OK                   │
│                       │  Modified     + new body               │
│                       │     │            │                     │
│                       │     ▼            ▼                     │
│                       │  ┌──────┐   ┌───────────┐              │
│                       │  │Serve │   │Update     │              │
│                       │  │cached│   │cache with │              │
│                       │  │copy  │   │new response│             │
│                       │  └──────┘   └───────────┘              │
│                       │                                        │
│                       ▼                                        │
│                  ┌───────────┐                                 │
│                  │ Full      │                                 │
│                  │ request   │                                 │
│                  │ (download │                                 │
│                  │ everything│                                 │
│                  │ again)    │                                 │
│                  └───────────┘                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎭 The `Vary` Header — Why It Matters

Here's a subtle but critical problem:

1. User A requests `/api/data` and gets a **gzip-compressed** response (because their browser sent `Accept-Encoding: gzip`)
2. The CDN caches this gzip response
3. User B requests `/api/data` but their browser doesn't support gzip
4. The CDN serves the **gzip** version → 💥 User B can't read it!

The `Vary` header solves this:

```
Vary: Accept-Encoding
```

This tells caches: "The response varies based on the `Accept-Encoding` header. Cache different versions for different `Accept-Encoding` values."

```
┌────────────────────────────────────────────────────┐
│              CDN CACHE WITH Vary                   │
│                                                    │
│  URL: /api/data                                    │
│                                                    │
│  ┌────────────────────────────────────────────┐    │
│  │ Key: /api/data + Accept-Encoding: gzip     │    │
│  │ Value: <gzip-compressed response>          │    │
│  ├────────────────────────────────────────────┤    │
│  │ Key: /api/data + Accept-Encoding: br       │    │
│  │ Value: <brotli-compressed response>        │    │
│  ├────────────────────────────────────────────┤    │
│  │ Key: /api/data + Accept-Encoding: identity │    │
│  │ Value: <uncompressed response>             │    │
│  └────────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Common `Vary` Values

```bash
# See Vary headers on real sites
curl -sI https://httpbin.org/gzip | grep -i vary
```

| Vary Value         | Why | Example |
|--------------------|-----|---------|
| `Accept-Encoding` | Different compression formats | gzip vs brotli vs none |
| `Accept-Language` | Different language versions | English vs French |
| `Accept` | Different content types | JSON vs XML |
| `Cookie` | Different per user | ⚠️ Effectively uncacheable! |
| `*` (asterisk) | Varies on everything | ⚠️ Completely uncacheable! |

> ⚠️ **Warning:** `Vary: Cookie` makes caching nearly useless because every user has different cookies. If you see this, something is probably wrong. Use `private` instead, or restructure so the response doesn't actually vary by cookie.

---

## 🎯 Caching Strategies — What to Cache and How

Different resources need different caching strategies. Here's the definitive guide:

### Strategy 1: HTML Pages — `no-cache`

```
Cache-Control: no-cache
```

HTML is the entry point. It contains references to CSS/JS files (often with hashes). If the HTML is stale, users might load old JS with new APIs = 💥.

```
Why not no-store? Because no-cache still lets us benefit from 304s.
If the HTML hasn't changed, we save bandwidth by getting just the
304 response (tiny) instead of re-downloading the whole page.
```

### Strategy 2: Versioned Static Assets — `immutable`

```
Cache-Control: public, max-age=31536000, immutable
```

Files like `app.3a7b9c2e.js` or `styles.8f2d1a.css` have a content hash in the filename. If the content changes, the filename changes. So the old filename's content can **never** change — it's safe to cache forever.

```
max-age=31536000 = 1 year (maximum practical value)
immutable       = don't revalidate even on reload
public          = CDN can cache too
```

### Strategy 3: API Responses — Depends on the API

```
# Public, infrequently changing data (e.g., product catalog)
Cache-Control: public, max-age=300, stale-while-revalidate=60

# Private, frequently changing data (e.g., user's notifications)
Cache-Control: private, no-cache

# Sensitive data (e.g., bank balance)
Cache-Control: no-store

# Semi-public data (e.g., stock prices — same for everyone, changes fast)
Cache-Control: public, max-age=5, must-revalidate
```

### Strategy 4: User-Specific Data — `private`

```
Cache-Control: private, no-cache
```

User dashboards, profile pages, etc. These MUST NOT be cached by CDNs (a CDN serving User A's dashboard to User B would be a security disaster).

### Strategy 5: Images and Fonts — Long Cache

```
Cache-Control: public, max-age=2592000
```

Images and fonts rarely change. Cache for 30 days. If you use content-based URLs (like from a CMS), you can cache for even longer.

---

### 📋 Complete Strategy Reference

```
┌──────────────────────────────────────────────────────────────────────┐
│              WHAT CACHE-CONTROL SHOULD I USE?                      │
│                                                                      │
│  Is the content sensitive (banking, medical, passwords)?            │
│     YES → no-store                                                  │
│     NO  ↓                                                           │
│                                                                      │
│  Is the content user-specific?                                      │
│     YES → private, ...                                              │
│     NO  → public, ...                                               │
│                  ↓                                                   │
│  Does the filename contain a content hash?                          │
│     YES → max-age=31536000, immutable                               │
│     NO  ↓                                                           │
│                                                                      │
│  How often does it change?                                          │
│     Every request  → no-cache (revalidate every time)              │
│     Every few min  → max-age=60, stale-while-revalidate=30        │
│     Every few hrs  → max-age=3600                                  │
│     Rarely         → max-age=86400 (or more)                       │
│     Never          → max-age=31536000                              │
│                                                                      │
│  Is showing stale data dangerous (financial, inventory)?           │
│     YES → add must-revalidate                                      │
│     NO  → add stale-while-revalidate=N for better UX              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 💥 Cache Busting — When You Need to Force an Update

Cache busting is the technique of **forcing browsers to download a new version** of a file, even if the old version is cached.

### Method 1: Content Hash in Filename (✅ Best Practice)

Build tools (Webpack, Vite, etc.) generate filenames with a hash of the file content:

```
app.js        →  app.3a7b9c2e.js
styles.css    →  styles.8f2d1a4b.css
logo.png      →  logo.c9d0e1f2.png
```

When the content changes, the hash changes, so the filename changes:
```
# Before change:
<script src="/js/app.3a7b9c2e.js"></script>

# After change (new hash = new URL = browser fetches fresh):
<script src="/js/app.f4e5d6c7.js"></script>
```

The old file can stay cached forever — nobody will request it again because the HTML now points to the new filename.

### Method 2: Query String (⚠️ Works, But Has Downsides)

```
<script src="/js/app.js?v=1.2.3"></script>
<script src="/js/app.js?v=1.2.4"></script>
```

**Downsides:**
- Some CDNs and proxies **ignore query strings** when caching (they cache `app.js?v=1` and `app.js?v=2` as the same resource)
- Some proxies **won't cache at all** if there's a query string
- Harder to manage manually

### Method 3: Change the Path (✅ Also Good)

```
<script src="/v1.2.3/js/app.js"></script>
<script src="/v1.2.4/js/app.js"></script>
```

This works well because the URL is completely different, so all caches treat it as a new resource.

---

## 🚫 Common Caching Mistakes

### Mistake 1: Confusing `no-cache` and `no-store`

```
❌ "I don't want caching, so I'll use no-cache"
   → WRONG! no-cache still caches, it just revalidates every time.

✅ "I don't want caching, so I'll use no-store"
   → Correct! no-store prevents any caching.
```

### Mistake 2: Caching Authenticated Responses on CDNs

```
❌ Cache-Control: public, max-age=3600
   → On a page with user-specific content
   → CDN caches User A's dashboard
   → Serves it to User B 😱

✅ Cache-Control: private, no-cache
   → Only browser caches, always revalidates
```

### Mistake 3: Not Using `Vary` When You Should

```
❌ Server returns gzip or plain based on Accept-Encoding
   but doesn't send Vary: Accept-Encoding
   → CDN might serve gzip to a client that can't decompress

✅ Vary: Accept-Encoding
   → CDN caches separate versions for each encoding
```

### Mistake 4: Long `max-age` Without Cache Busting

```
❌ Cache-Control: max-age=31536000  (on app.js)
   → You update app.js, but users see the year-old version
   → No way to force update (filename didn't change!)

✅ Cache-Control: max-age=31536000, immutable  (on app.3a7b.js)
   → Content changes = new hash = new filename
   → Old cached files don't matter, new URL = fresh download
```

### Mistake 5: Over-Caching API Responses

```
❌ Cache-Control: max-age=3600 (on /api/user/balance)
   → User makes a payment but still sees old balance for an hour!

✅ Cache-Control: private, no-cache (on /api/user/balance)
   → Always checks with server, but saves bandwidth via 304
```

### Mistake 6: The `Expires` + `Cache-Control` Conflict

```
⚠️ Don't mix old and new:
   Expires: Thu, 01 Dec 2025 16:00:00 GMT
   Cache-Control: max-age=3600

   Cache-Control wins (it takes priority), but it's confusing.
   Just use Cache-Control alone.
```

---

## 🏗️ Caching in System Design

In system design interviews and real architecture, caching goes far beyond HTTP headers. Let's zoom out.

### CDN Caching (Edge Caching)

CDNs like Cloudflare, AWS CloudFront, and Akamai cache your content on **edge servers** distributed worldwide:

```
                    ┌──── Edge Server (Tokyo)
                    │     [Cached Copy]
                    │
User (Japan) ──────-┤
                    │
                    ├──── Edge Server (Mumbai)
                    │     [Cached Copy]
                    │
                    ├──── Edge Server (London)
                    │     [Cached Copy]
                    │
                    └──── Origin Server (US-East)
                          [Source of Truth]
```

**CDN Caching Flow:**
1. User in Tokyo requests `image.png`
2. CDN checks Tokyo edge server → Cache MISS
3. CDN fetches from origin (US-East) → Returns to user, stores in Tokyo edge
4. Next user in Tokyo requests same file → Cache HIT → Served from Tokyo (~20ms vs ~200ms)

```bash
# Observe CDN caching with multiple requests
# First request might be a MISS, second should be a HIT
curl -sI https://www.cloudflare.com/favicon.ico | grep -i 'cf-cache-status\|age\|cache-control'
```

### Application-Level Caching (Redis / Memcached)

HTTP caching handles the network layer. But what about expensive **database queries** and **computations** on the server?

```
┌─────────────────────────────────────────────────┐
│            APPLICATION CACHE FLOW              │
│                                                 │
│  Request: GET /api/popular-products            │
│                                                 │
│  Server:                                       │
│    1. Check Redis: "popular_products" key?     │
│       ├─ HIT → Return cached result (1ms)     │
│       └─ MISS ↓                                │
│    2. Query database                           │
│       SELECT * FROM products                   │
│       ORDER BY sales DESC LIMIT 100 (200ms)   │
│    3. Store in Redis with TTL (60 seconds)     │
│    4. Return result                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

Common patterns:
- **Cache-Aside (Lazy Loading):** App checks cache first, on miss fetches from DB and stores in cache
- **Write-Through:** Every DB write also updates the cache
- **Write-Behind:** Writes go to cache first, cache updates DB asynchronously

### The Cache Invalidation Problem

> *"The two hardest things in CS: cache invalidation and naming things."*

Why is invalidation hard? Because caches are **distributed**. When data changes:

```
Problem: User updates their profile photo

- Browser cache: Has the old photo (you can't reach into the user's browser)
- CDN edge Tokyo: Has the old photo
- CDN edge London: Has the old photo  
- CDN edge Mumbai: Doesn't have it (never requested)
- Redis cache: Has the old photo
- Database: Has the NEW photo ← source of truth

How do you update ALL of them simultaneously?
Answer: You can't. Not instantly. Not reliably.
```

**Strategies for cache invalidation:**

| Strategy           | How It Works                                 | Trade-off |
|--------------------|----------------------------------------------|-----------------------------------|
| **TTL-based**      | Set expiry time. Wait for it to expire.      | Simple, but stale data during TTL |
| **Purge/Bust**     | Actively delete from cache when data changes | Complex, may miss some caches     |
| **Versioned URLs** | New data = new URL. Old URL still cached.    | Best for static assets            |
| **Event-driven**   | Pub/sub: "data changed" → purge all caches   | Complex but powerful              |

### TTL Strategy Guide

| Content Type          | TTL                | Rationale                                 |
|-----------------------|--------------------|-------------------------------------------|
| DNS records           | 300s (5 min)       | Balance between freshness and DNS load    |
| API response (public) | 60-300s            | Depends on data change frequency          |
| User session (Redis)  | 1800s (30 min)     | Security vs convenience                   |
| Static assets         | 31536000s (1 year) | Use cache busting for updates             |
| Search results        | 30-60s             | Frequent updates, user expects fresh data |
| Product catalog       | 300-900s           | Changes daily, not per-second             |

---

## 🧪 Try It Yourself

### Experiment 1: Inspect Cache Headers on Real Sites

```bash
# Google — heavily cached static assets
curl -sI https://www.google.com | grep -i 'cache-control\|etag\|last-modified\|expires\|vary'

# GitHub — API caching
curl -sI https://api.github.com | grep -i 'cache-control\|etag\|last-modified\|vary'

# A CDN-hosted JS library
curl -sI https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js | grep -i 'cache-control\|etag\|vary'
```

### Experiment 2: Watch Conditional Requests Work

```bash
# Step 1: Get the ETag
ETAG=$(curl -sI https://httpbin.org/etag/test123 | grep -i etag | tr -d '\r' | awk '{print $2}')
echo "ETag: $ETAG"

# Step 2: Send conditional request with matching ETag → expect 304
curl -s -o /dev/null -w "Matching ETag: HTTP %{http_code}\n" \
  -H "If-None-Match: $ETAG" \
  https://httpbin.org/etag/test123

# Step 3: Send with non-matching ETag → expect 200
curl -s -o /dev/null -w "Wrong ETag: HTTP %{http_code}\n" \
  -H "If-None-Match: \"wrong\"" \
  https://httpbin.org/etag/test123
```

### Experiment 3: Set Custom Cache-Control Headers

```bash
# Use httpbin to return custom cache headers
curl -sI "https://httpbin.org/response-headers?Cache-Control=public,max-age=3600,must-revalidate" \
  | grep -i cache-control

# Simulate no-store
curl -sI "https://httpbin.org/response-headers?Cache-Control=no-store" \
  | grep -i cache-control

# Simulate a versioned asset strategy
curl -sI "https://httpbin.org/response-headers?Cache-Control=public,max-age=31536000,immutable" \
  | grep -i cache-control
```

### Experiment 4: Observe the `Vary` Header

```bash
# Check what a server says varies
curl -sI https://httpbin.org/gzip | grep -i vary

# Request with different Accept-Encoding and see how it might affect caching
curl -sI -H "Accept-Encoding: gzip" https://httpbin.org/gzip | grep -i 'content-encoding\|vary'
curl -sI -H "Accept-Encoding: identity" https://httpbin.org/gzip | grep -i 'content-encoding\|vary'
```

---

## 🔑 Key Takeaways

1. **Caching happens at many layers** — Browser, proxy, CDN, server. Each has its role.

2. **`Cache-Control` is king** — It replaces `Expires` and gives you fine-grained control. Know every directive.

3. **`no-cache` ≠ don't cache** — It means "cache, but revalidate every time." Use `no-store` if you truly don't want caching.

4. **Validation saves bandwidth** — ETags and Last-Modified let you get 304 (no body) instead of re-downloading unchanged content.

5. **`Vary` prevents serving wrong content** — Always include `Vary: Accept-Encoding` if you compress responses.

6. **Match strategy to content type:**
   - HTML → `no-cache`
   - Versioned assets → `max-age=31536000, immutable`
   - APIs → depends on sensitivity and freshness needs
   - Sensitive data → `no-store`

7. **Cache busting = content hashes in filenames** — This is the gold standard. Query strings are a fallback.

8. **Cache invalidation is genuinely hard** — Use TTLs as your first tool, versioned URLs for assets, and event-driven purging for dynamic data.

9. **In system design, caching is everywhere** — CDNs, Redis, database query caches, DNS caches. Know the trade-offs at every level.

10. **When in doubt, start conservative** — It's easier to extend cache times than to purge stale content from thousands of edge servers.

---

*Next Chapter: HTTP/2 and HTTP/3 — The protocol evolves, and so does caching... →*
