# 04 — HTTP Status Codes

## 🤔 What Are Status Codes?

Every HTTP response includes a **status code** — a 3-digit number that tells you what happened with your request.

```
HTTP/1.1 200 OK          ← 200 is the status code, "OK" is the reason phrase
HTTP/1.1 404 Not Found   ← 404 is the status code, "Not Found" is the reason phrase
```

## 📊 The 5 Categories

Status codes are grouped by their **first digit**:

| Range | Category        | Meaning                                |
|-------|-----------------|----------------------------------------|
| 1xx   | Informational   | Request received, continuing process   |
| 2xx   | Success         | Request was successfully processed     |
| 3xx   | Redirection     | Further action needed to complete      |
| 4xx   | Client Error    | Something wrong with YOUR request      |
| 5xx   | Server Error    | Server failed to handle valid request  |

> **Easy way to remember:** 
> - 2xx = 😊 All good!
> - 3xx = 🔀 Go somewhere else
> - 4xx = 😤 YOU messed up
> - 5xx = 💥 SERVER messed up

---

## ✅ 2xx — Success

### 200 OK
- **The most common one.** Request was successful.
- GET → returns the resource
- POST → returns confirmation + created resource
```bash
curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/get
# Output: 200
```

### 201 Created
- A new resource was **successfully created**
- Usually returned after a successful `POST`
- Often includes `Location` header pointing to the new resource
```
POST /api/users → 201 Created
Location: /api/users/42
```

### 204 No Content
- Request was successful, but there's **no body to return**
- Common for `DELETE` responses
```
DELETE /api/users/42 → 204 No Content
(empty body)
```

### 202 Accepted
- Request has been **accepted for processing**, but not completed yet
- Used for async operations (e.g., "your video is being processed")

---

## 🔀 3xx — Redirection

### 301 Moved Permanently
- Resource has **permanently moved** to a new URL
- Browser will update bookmarks and use new URL in future
- Has `Location` header with the new URL
```bash
curl -v http://github.com
# You'll see: Location: https://github.com/
# It redirects HTTP → HTTPS
```

### 302 Found (Temporary Redirect)
- Resource is **temporarily** at a different URL
- Browser should keep using the old URL for future requests

### 304 Not Modified
- Resource **hasn't changed** since you last requested it
- Used with caching (If-Modified-Since / ETag headers)
- Browser uses its cached version instead

### 307 Temporary Redirect
- Like 302, but **guarantees the method won't change**
- POST remains POST (302 might change to GET)

### 308 Permanent Redirect
- Like 301, but **guarantees the method won't change**

```bash
# See a redirect in action
curl -v -L http://github.com 2>&1 | grep -i "location\|HTTP/"
# -L tells curl to follow redirects
```

---

## 😤 4xx — Client Errors (YOUR fault)

### 400 Bad Request
- Server **couldn't understand** your request
- Malformed syntax, invalid parameters
```
POST /api/users with body: "not valid json{{"
→ 400 Bad Request
```

### 401 Unauthorized
- You need to **authenticate** (log in) first
- "Who are you? I don't know you"
```
GET /api/my-profile  (without auth token)
→ 401 Unauthorized
```

### 403 Forbidden
- You're authenticated, but **don't have permission**
- "I know who you are, but you can't do this"
```
DELETE /api/admin/users/42  (as a regular user)
→ 403 Forbidden
```

### 404 Not Found
- The resource **doesn't exist** at this URL
```bash
curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/this-doesnt-exist
# Output: 404
```

### 405 Method Not Allowed
- The HTTP **method** isn't supported for this resource
```
DELETE /api/homepage  (you can't delete the homepage!)
→ 405 Method Not Allowed
```

### 408 Request Timeout
- Server waited too long for your request
- Client was too slow sending data

### 409 Conflict
- Request conflicts with current state of the resource
```
POST /api/users with {"email": "already@exists.com"}
→ 409 Conflict (email already registered)
```

### 422 Unprocessable Entity
- Server understood the request, but it's **semantically invalid**
```
POST /api/users with {"name": "", "age": -5}
→ 422 Unprocessable Entity (validation failed)
```

### 429 Too Many Requests
- You've sent **too many requests** in a given time (rate limiting)
- Often includes `Retry-After` header
```bash
# Try hitting an API endpoint many times rapidly to see this
```

---

## 💥 5xx — Server Errors (SERVER's fault)

### 500 Internal Server Error
- Server crashed / had an unhandled error
- The "something went wrong" catch-all

### 502 Bad Gateway
- Server acting as a gateway/proxy got an **invalid response** from upstream
- Common with reverse proxies (Nginx, load balancers)

### 503 Service Unavailable
- Server is **temporarily overloaded** or under maintenance
- Usually temporary — try again later

### 504 Gateway Timeout
- Server acting as gateway didn't get a response in time
- The upstream server is too slow

---

## 🧪 Try It Yourself

httpbin.org lets you get any status code you want:

```bash
# Get a 200
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/200

# Get a 201
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/201

# Get a 404
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/404

# Get a 500
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/500

# Get a random status from a list
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/200,201,204,400,404,500

# See a redirect chain
curl -v -L https://httpbin.org/redirect/3
```

---

## 📊 Quick Reference Cheat Sheet

| Code | Name                  | When You'll See It                    |
|------|-----------------------|---------------------------------------|
| 200  | OK                    | Successful GET/PUT/PATCH              |
| 201  | Created               | Successful POST (resource created)    |
| 204  | No Content            | Successful DELETE                     |
| 301  | Moved Permanently     | URL changed forever                   |
| 302  | Found                 | Temporary redirect                    |
| 304  | Not Modified          | Cached version is still good          |
| 400  | Bad Request           | Malformed request                     |
| 401  | Unauthorized          | Not logged in                         |
| 403  | Forbidden             | No permission                         |
| 404  | Not Found             | Resource doesn't exist                |
| 405  | Method Not Allowed    | Wrong HTTP method                     |
| 409  | Conflict              | Data conflict                         |
| 422  | Unprocessable Entity  | Validation failed                     |
| 429  | Too Many Requests     | Rate limited                          |
| 500  | Internal Server Error | Server crashed                        |
| 502  | Bad Gateway           | Proxy got bad response                |
| 503  | Service Unavailable   | Server overloaded/maintenance         |

---

## 📝 Key Takeaways

- Status codes are 3-digit numbers indicating request outcome
- First digit tells the category: 1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error
- 4xx = your problem to fix, 5xx = server's problem
- 401 (not authenticated) ≠ 403 (not authorized) — they're different!
- Always handle different status codes in your code

---

**← Previous:** [03 — HTTP Methods](../03_http_methods/lesson.md)
**Next →** [05 — Headers](../05_headers/lesson.md)
