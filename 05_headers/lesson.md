# 05 — HTTP Headers

## 🤔 What Are Headers?

Headers are **key-value pairs** that carry metadata about the request or response. They tell the client and server extra information like:
- What format is the data in?
- Who is making the request?
- Is this response cacheable?
- What language does the user prefer?

```
Header-Name: Header-Value
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

> **Headers are NOT case-sensitive** → `Content-Type` = `content-type` = `CONTENT-TYPE`

---

## 📋 Types of Headers

Headers are categorized by their purpose:

### 1. 📤 Request Headers (Client → Server)

These are sent **by the client** to give the server info about the request.

#### `Host` ⭐
```
Host: www.example.com
```
- **Required** in HTTP/1.1
- Tells the server which website you want (a server can host multiple sites)

#### `User-Agent`
```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
```
- Identifies the client (browser, curl, your app)
- Servers may return different content based on this (e.g., mobile vs desktop)

#### `Accept`
```
Accept: application/json
Accept: text/html, application/xhtml+xml
Accept: */*
```
- Tells the server what **content types** you can handle
- Server uses this to decide response format

#### `Accept-Language`
```
Accept-Language: en-US, en;q=0.9, hi;q=0.8
```
- Preferred languages (with quality weights)
- `q=0.9` means "90% preference"

#### `Accept-Encoding`
```
Accept-Encoding: gzip, deflate, br
```
- What compression algorithms you support
- Server can compress the response to save bandwidth

#### `Authorization`
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0Mn0.abc123
Authorization: Basic bmFtYW46cGFzc3dvcmQ=
```
- Sends authentication credentials
- Common formats: **Bearer** (tokens), **Basic** (base64 encoded user:pass)

#### `Cookie`
```
Cookie: session_id=abc123; theme=dark; lang=en
```
- Sends cookies back to the server
- Multiple cookies separated by `;`

#### `Referer`
```
Referer: https://www.google.com/search?q=http+headers
```
- The URL you came from (yes, "Referer" is a misspelling that stuck!)
- Used for analytics, security

#### `Origin`
```
Origin: https://myapp.com
```
- Where the request originated from
- Used in **CORS** (Cross-Origin Resource Sharing)

---

### 2. 📥 Response Headers (Server → Client)

These are sent **by the server** to give the client info about the response.

#### `Content-Type` ⭐
```
Content-Type: application/json; charset=utf-8
Content-Type: text/html; charset=UTF-8
Content-Type: image/png
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
```
- What format the body is in
- **Most important header** — tells the client how to parse the response

Common MIME types:
| MIME Type               | Data Format          |
|-------------------------|----------------------|
| `application/json`      | JSON                 |
| `text/html`             | HTML                 |
| `text/plain`            | Plain text           |
| `text/css`              | CSS                  |
| `application/javascript`| JavaScript           |
| `image/png`             | PNG image            |
| `image/jpeg`            | JPEG image           |
| `application/pdf`       | PDF file             |
| `multipart/form-data`   | File uploads         |
| `application/xml`       | XML                  |

#### `Content-Length`
```
Content-Length: 1234
```
- Size of the response body in **bytes**
- Helps the client know when it has received the full response

#### `Set-Cookie`
```
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; Max-Age=3600
```
- Server tells browser to **store a cookie**
- Various attributes control cookie behavior

#### `Cache-Control`
```
Cache-Control: max-age=3600
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: public, max-age=86400
```
- Controls how the response should be cached
- `max-age=3600` → cache for 1 hour
- `no-cache` → always revalidate with server
- `no-store` → never cache (sensitive data)

#### `Location`
```
Location: https://www.example.com/new-page
```
- Used with 3xx redirects to tell the client where to go

#### `ETag`
```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```
- A unique identifier for a specific version of a resource
- Used for caching — client can send `If-None-Match` to check if resource changed

#### `Access-Control-Allow-Origin` (CORS)
```
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Origin: *
```
- Controls which websites can make requests to this server
- `*` means any website can access it

---

### 3. 🔄 Representation Headers (Can be in both)

#### `Content-Type` (also in request)
```
Content-Type: application/json
```
- In requests, tells the server what format the body is in (for POST/PUT/PATCH)

#### `Content-Encoding`
```
Content-Encoding: gzip
```
- What compression was applied to the body

#### `Content-Language`
```
Content-Language: en-US
```
- Language of the content

---

### 4. 🔒 Security Headers (Response)

#### `Strict-Transport-Security` (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
- Forces HTTPS for the specified duration

#### `X-Content-Type-Options`
```
X-Content-Type-Options: nosniff
```
- Prevents browser from guessing (sniffing) the content type

#### `X-Frame-Options`
```
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```
- Controls if the page can be loaded in an iframe
- Prevents clickjacking attacks

#### `Content-Security-Policy` (CSP)
```
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com
```
- Controls what resources the page can load
- Prevents XSS attacks

---

### 5. 🎛 Custom Headers

You can create your own headers! Convention is to use `X-` prefix (though this is deprecated):

```
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1622505600
```

---

## 🧪 Try It Yourself

```bash
# See all request and response headers
curl -v https://httpbin.org/get

# Send custom headers
curl -H "X-Custom-Header: hello" \
     -H "Accept: application/json" \
     https://httpbin.org/headers

# See what your request headers look like to the server
curl https://httpbin.org/headers

# See response headers only
curl -I https://httpbin.org/get

# See response headers for a site with security headers
curl -I https://github.com
```

---

## 📊 Most Important Headers Cheat Sheet

| Header                    | Direction | Purpose                              |
|---------------------------|-----------|--------------------------------------|
| `Content-Type`                 | Both      | Format of the body                   |
| `Authorization`                | Request   | Authentication credentials           |
| `Accept`                       | Request   | What formats client understands      |
| `Host`                         | Request   | Which website you want               |
| `User-Agent`                   | Request   | Identifies the client                |
| `Cookie`                       | Request   | Sends stored cookies                 |
| `Set-Cookie`                   | Response  | Creates new cookies                  |
| `Cache-Control`                | Response  | Caching instructions                 |
| `Location`                     | Response  | Where to redirect                    |
| `Content-Length`               | Both      | Body size in bytes                  |
| `Access-Control-Allow-Origin`  | Response | CORS permission                   |

---

## 📝 Key Takeaways

- Headers carry metadata about HTTP messages
- They are key-value pairs, case-insensitive
- Request headers tell the server about the client and what it wants
- Response headers tell the client about the response and how to handle it
- `Content-Type` is the most important — it tells how to parse the body
- Security headers protect against common web attacks
- You can create custom headers for your own needs

---

**← Previous:** [04 — Status Codes](../04_status_codes/lesson.md)
**Next →** [06 — Request & Response Cycle](../06_request_response_cycle/lesson.md)
