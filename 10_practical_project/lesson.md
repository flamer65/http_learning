# 10 — Practical Project: Build an HTTP Client

## 🎯 Project Goal

Put everything you've learned into practice! You'll build a **command-line HTTP client** in Node.js that can:

1. Make GET, POST, PUT, PATCH, DELETE requests
2. Set custom headers
3. Send JSON body
4. Display status codes, headers, and body
5. Handle redirects
6. Measure timing

---

## 📋 Project Structure

```
10_practical_project/
├── lesson.md          ← You are here
└── exercises/
    ├── 01_basic_get.js        ← Step 1: Simple GET
    ├── 02_with_headers.js     ← Step 2: Custom headers
    ├── 03_post_json.js        ← Step 3: POST with JSON body
    ├── 04_all_methods.js      ← Step 4: Support all methods
    ├── 05_full_client.js      ← Step 5: Complete client
    └── README.md              ← Instructions
```

---

## 🚀 Step 1: Basic GET Request

**File:** `exercises/01_basic_get.js`

Using Node.js built-in `https` module (no external libraries!), make a GET request.

```javascript
// Your task: Build this from scratch!
// Use the built-in 'https' module
// Make a GET request to https://httpbin.org/get
// Print:
//   - Status Code
//   - Response Headers (as key: value pairs)
//   - Response Body (parsed JSON)
```

**Hints:**
- Use `const https = require('https')` or `import https from 'https'`
- `https.get(url, callback)` for GET requests
- Response comes in chunks — collect them with `data` event
- Parse with `JSON.parse()` when done

**Expected output:**
```
Status: 200 OK
Headers:
  content-type: application/json
  content-length: 255
  ...
Body:
{
  "args": {},
  "headers": { ... },
  "url": "https://httpbin.org/get"
}
```

---

## 🚀 Step 2: Custom Headers

**File:** `exercises/02_with_headers.js`

Make a GET request with custom headers.

```javascript
// Your task: Make a GET request to https://httpbin.org/headers
// Set these custom headers:
//   - Accept: application/json
//   - X-Custom-Header: learning-http
//   - User-Agent: MyHTTPClient/1.0
// Print the response to see if the server received your headers
```

**Hints:**
- Use `https.request(options, callback)` instead of `https.get()`
- Pass headers in the `options` object:
  ```javascript
  const options = {
    hostname: 'httpbin.org',
    path: '/headers',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // ... more headers
    }
  };
  ```

---

## 🚀 Step 3: POST with JSON Body

**File:** `exercises/03_post_json.js`

Send a POST request with a JSON body.

```javascript
// Your task: Send a POST request to https://httpbin.org/post
// Body: {"name": "Naman", "skill": "HTTP", "level": "intermediate"}
// Headers: Content-Type: application/json
// Print the full response
```

**Hints:**
- Set method to `POST` in options
- Set `Content-Type: application/json` header
- Calculate and set `Content-Length` header
- Use `req.write(body)` to send the body
- Call `req.end()` to finish

---

## 🚀 Step 4: Support All Methods

**File:** `exercises/04_all_methods.js`

Create a reusable function that supports any HTTP method.

```javascript
// Your task: Create a function:
// async function httpRequest(method, url, headers = {}, body = null)
//
// It should:
// - Support GET, POST, PUT, PATCH, DELETE
// - Accept custom headers
// - Accept optional body (as object, auto-stringify to JSON)
// - Return { statusCode, headers, body }
//
// Test it with:
// httpRequest('GET', 'https://httpbin.org/get')
// httpRequest('POST', 'https://httpbin.org/post', {}, { name: 'Naman' })
// httpRequest('PUT', 'https://httpbin.org/put', {}, { name: 'Naman', updated: true })
// httpRequest('DELETE', 'https://httpbin.org/delete')
```

---

## 🚀 Step 5: Full HTTP Client

**File:** `exercises/05_full_client.js`

Build the complete client with all features:

```javascript
// Your task: Build a CLI tool that accepts:
//   node 05_full_client.js GET https://httpbin.org/get
//   node 05_full_client.js POST https://httpbin.org/post '{"name":"Naman"}'
//   node 05_full_client.js PUT https://httpbin.org/put '{"name":"Updated"}'
//
// Features:
// 1. Parse command line arguments (method, url, body)
// 2. Make the HTTP request
// 3. Show timing (DNS, connect, total)
// 4. Show status code with color (2xx=green, 4xx=yellow, 5xx=red)
// 5. Show response headers
// 6. Show formatted response body
// 7. Follow redirects (3xx)
```

### Expected output:
```
$ node 05_full_client.js GET https://httpbin.org/get

🌐 GET https://httpbin.org/get
⏱  Total time: 234ms

📊 Status: 200 OK
📋 Headers:
   content-type: application/json
   content-length: 255
   
📦 Body:
{
  "args": {},
  "headers": {
    "Host": "httpbin.org",
    "User-Agent": "MyHTTPClient/1.0"
  },
  "url": "https://httpbin.org/get"
}
```

---

## 💡 Bonus Challenges

After completing the main project, try these:

### Bonus 1: Retry Logic
Add automatic retry with exponential backoff for 5xx errors:
```
Request failed (500) — retrying in 1s...
Request failed (500) — retrying in 2s...
Request failed (500) — retrying in 4s...
```

### Bonus 2: Request History
Save all requests/responses to a JSON file for later review.

### Bonus 3: Cookie Jar
Automatically save and resend cookies (like a browser).

### Bonus 4: Parallel Requests
Make multiple requests at the same time and compare timing.

---

## 📝 What You'll Practice

By completing this project, you'll have used:
- ✅ HTTP Methods (GET, POST, PUT, PATCH, DELETE)
- ✅ URLs (parsing, query params)
- ✅ Status Codes (handling different responses)
- ✅ Headers (request & response, custom headers)
- ✅ Request/Response Cycle (full flow)
- ✅ Body (JSON, Content-Type, Content-Length)
- ✅ HTTPS (TLS connections)

---

**← Previous:** [09 — HTTPS & Security](../09_https_and_security/lesson.md)

🎉 **Congrats! You've completed the HTTP Learning Path!**
