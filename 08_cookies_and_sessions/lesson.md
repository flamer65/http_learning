# 08 — Cookies & Sessions

## 🤔 The Problem: HTTP is Stateless

Remember from Lesson 01: **HTTP is stateless**. Each request is independent — the server doesn't remember who you are between requests.

```
Request 1: GET /login   → "Please log in"
Request 2: GET /profile → "Please log in"  😤 (Server forgot you logged in!)
```

**Cookies** solve this problem by letting the server store small pieces of data in your browser.

---

## 🍪 How Cookies Work

```
 Browser                              Server
    │                                    │
    │── POST /login ──────────────────> │  "Here are my credentials"
    │                                    │  (Server validates & creates session)
    │<── 200 OK ─────────────────────── │
    │    Set-Cookie: session_id=abc123   │  "Store this cookie"
    │                                    │
    │── GET /profile ─────────────────> │
    │   Cookie: session_id=abc123        │  "Here's my cookie" (auto-sent!)
    │                                    │  (Server looks up session abc123)
    │<── 200 OK ─────────────────────── │
    │    {"name": "Naman", ...}          │  "I know who you are!"
```

### Step-by-step:
1. Server sends `Set-Cookie` header in response → browser stores it
2. Browser automatically sends `Cookie` header in every subsequent request to that domain
3. Server reads the cookie to identify the user

---

## 📝 Set-Cookie Syntax

```
Set-Cookie: name=value; attribute1; attribute2; ...
```

### Full Example:
```
Set-Cookie: session_id=abc123; Path=/; Domain=.example.com; Max-Age=3600; HttpOnly; Secure; SameSite=Strict
```

### Cookie Attributes:

| Attribute    | Example              | Purpose                                           |
|--------------|----------------------|---------------------------------------------------|
| `Path`       | `Path=/`             | Cookie sent for this path and sub-paths           |
| `Domain`     | `Domain=.example.com`| Cookie sent to this domain and subdomains         |
| `Max-Age`    | `Max-Age=3600`       | Cookie expires in 3600 seconds (1 hour)           |
| `Expires`    | `Expires=Thu, 01 Jan 2027 00:00:00 GMT` | Specific expiry date           |
| `HttpOnly`   | `HttpOnly`           | JavaScript can't access this cookie (security!)   |
| `Secure`     | `Secure`             | Only sent over HTTPS                              |
| `SameSite`   | `SameSite=Strict`    | Controls cross-site cookie sending                |

---

## 🔒 Cookie Security Attributes

### HttpOnly
```
Set-Cookie: session=abc; HttpOnly
```
- JavaScript **cannot** read or modify this cookie
- Protects against **XSS attacks** (Cross-Site Scripting)
- `document.cookie` won't show HttpOnly cookies

### Secure
```
Set-Cookie: session=abc; Secure
```
- Cookie is **only sent over HTTPS**
- Prevents cookie from being sent over unencrypted HTTP

### SameSite
```
Set-Cookie: session=abc; SameSite=Strict
Set-Cookie: session=abc; SameSite=Lax
Set-Cookie: session=abc; SameSite=None; Secure
```
- **Strict** — Cookie NEVER sent on cross-site requests
- **Lax** — Cookie sent on top-level navigation (clicking links) but not on cross-site POST/AJAX
- **None** — Cookie always sent (must also set `Secure`)

> SameSite prevents **CSRF attacks** (Cross-Site Request Forgery)

---

## 🏪 Session vs Cookie

### Cookie
- Small piece of data **stored in the browser**
- Sent with every request to that domain
- Has size limits (~4KB per cookie)
- Can be read by JavaScript (unless HttpOnly)

### Session
- Data **stored on the server**
- Browser only stores a **session ID** (as a cookie)
- Server looks up the full session data using the ID
- More secure (sensitive data stays on server)

```
Cookie approach:
Set-Cookie: user=Naman; role=admin; email=n@x.com  ← Everything in cookie (risky!)

Session approach:
Set-Cookie: session_id=abc123  ← Just an ID
Server stores: { "abc123": { user: "Naman", role: "admin", email: "n@x.com" } }
```

---

## 🎫 Types of Cookies

### Session Cookies
- No `Max-Age` or `Expires` → deleted when browser closes
```
Set-Cookie: temp_id=xyz789
```

### Persistent Cookies
- Has `Max-Age` or `Expires` → survives browser restarts
```
Set-Cookie: preferences=dark_mode; Max-Age=31536000  (1 year)
```

### First-Party Cookies
- Set by the website you're visiting
- `example.com` sets cookies for `example.com`

### Third-Party Cookies
- Set by a different domain (usually ads/tracking)
- You visit `example.com` but `ads.tracker.com` sets a cookie
- Being phased out by browsers for privacy

---

## 🆚 Cookies vs Modern Alternatives

| Feature          | Cookies               | localStorage         | sessionStorage       | JWT Tokens          |
|------------------|-----------------------|----------------------|----------------------|---------------------|
| Stored where     | Browser               | Browser              | Browser              | Browser (usually)   |
| Sent to server   | ✅ Automatically      | ❌ Must send manually| ❌ Must send manually| ❌ Must send manually|
| Size limit       | ~4KB                  | ~5-10MB              | ~5-10MB              | No hard limit       |
| Expires          | Configurable          | Never (manual clear) | Tab close            | Configurable        |
| Accessible by JS | ✅ (unless HttpOnly)  | ✅                   | ✅                   | ✅                  |
| Server-side      | ❌ Client storage     | ❌                   | ❌                   | ❌ Self-contained   |

---

## 🧪 Try It Yourself

```bash
# 1. See cookies being set
curl -v https://httpbin.org/cookies/set/mycookie/hello123 2>&1 | grep -i "set-cookie\|cookie\|location"

# 2. Send cookies to the server
curl -b "name=naman;theme=dark;lang=en" https://httpbin.org/cookies

# 3. Save and reuse cookies (like a browser)
curl -c /tmp/cookies.txt https://httpbin.org/cookies/set/session/abc123
cat /tmp/cookies.txt
curl -b /tmp/cookies.txt https://httpbin.org/cookies

# 4. See cookies on a real site
curl -v -I https://www.google.com 2>&1 | grep -i "set-cookie"
```

---

## 📝 Key Takeaways

- Cookies solve HTTP's statelessness by storing data in the browser
- Server sends `Set-Cookie`, browser sends `Cookie` header automatically
- `HttpOnly` prevents JavaScript access (security)
- `Secure` ensures cookie only sent over HTTPS
- `SameSite` prevents cross-site request forgery
- Sessions store data on the server; only the session ID is in the cookie
- Modern alternatives: localStorage, sessionStorage, JWT tokens

---

**← Previous:** [07 — Request & Response Body](../07_request_response_body/lesson.md)
**Next →** [09 — HTTPS & Security](../09_https_and_security/lesson.md)
