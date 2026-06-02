# Exercises — CORS (Cross-Origin Resource Sharing)

## Exercise 1: Identify the Origin

For each URL, write the **origin** (scheme + host + port):

| URL                                      | Origin                         |
|------------------------------------------|--------------------------------|
| `https://example.com/page`               |scheme= https, host=example.com, port=443                                |
| `http://example.com:8080/api`            |scheme=http, host=example.com,port=8080                                |
| `https://api.example.com/v1/users`       |scheme=https,host=api.example.com/v1/users port=443                                |
| `http://localhost:3000/dashboard`        |scheme=http, host=localhost/dashboard port=3000                                |
| `https://example.com:443/about`          |scheme=https, host=example.com/about port=443                                |

Now determine: are these pairs same-origin or cross-origin?

| URL A                              | URL B                              | Same or Cross? | Why?                 |
|------------------------------------|------------------------------------|----------------|----------------------|
| `https://app.com/page1`           | `https://app.com/page2`             |same            |same domain and origin|
| `https://app.com`                 | `http://app.com`                    |Cross           |different scheme      |
| `https://app.com`                 | `https://api.app.com`               |Cross           |different host        |
| `http://localhost:3000`           | `http://localhost:5000`             |Cross           |different port        |
| `https://app.com:443`             | `https://app.com`                   |same            |same port,host,scheme |

---

## Exercise 2: Simple or Preflight?

For each scenario, determine whether the browser will send a **simple request** or trigger a **preflight (OPTIONS)** request. Explain why.

### 2a.

```javascript
fetch("https://api.example.com/users", {
    method: "GET"
});
```

```
Simple or Preflight? Simple 
Why? NO Origin speratly defined and method is only get which is considered safe and where as not specific headers to trigg the preflight
```

### 2b.

```javascript
fetch("https://api.example.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Naman" })
});
```

```
Simple or Preflight? Preflight
Why? content-type: application/json triges the options prefligth considered by the browser
```

### 2c.

```javascript
fetch("https://api.example.com/users/123", {
    method: "DELETE"
});
```

```
Simple or Preflight? Preflight 
Why? because method Delete is considered to asked by the server allwod or not
```

### 2d.

```javascript
fetch("https://api.example.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "q=cors+tutorial"
});
```

```
Simple or Preflight? simple
Why? as the there is no origin problem and method is also save and content-type also safe 
```

### 2e.

```javascript
fetch("https://api.example.com/data", {
    method: "GET",
    headers: { "Authorization": "Bearer token123" }
});
```

```
Simple or Preflight? Preflight 
Why? custom header with auth token asked first allowed to send token or not if the origin is same then no problem 
```

### 2f.

```javascript
fetch("https://api.example.com/upload", {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: formData
});
```

```
Simple or Preflight?  simple
Why? no problem for the origin, method and content type
```

---

## Exercise 3: Simulate CORS with curl

### 3a. Send a cross-origin GET request

```bash
curl -v -H "Origin: https://my-frontend.com" \
  https://httpbin.org/get 2>&1 | grep -i "access-control"
```

```
What CORS headers did the server send back?
access-control-allow-origin: *,
 access-control-expose-headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset, Warning

Does github allow your origin?
yes
```

### 3b. Simulate a preflight for a PUT request

```bash
curl -v -X OPTIONS \
  -H "Origin: https://my-frontend.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://httpbin.org/put 2>&1 | grep -i "access-control\|HTTP/"
```

```
What HTTP status code did the OPTIONS response return? 
200
What methods are listed in Access-Control-Allow-Methods?
Only PUT
What is the Access-Control-Max-Age value?
not given
```

### 3c. Check a real API's CORS policy

```bash
curl -sI -H "Origin: https://evil-hacker.com" \
  https://api.github.com/users/octocat | grep -i "access-control"
```

```
Does GitHub's API allow requests from https://evil-hacker.com?
yes
What is the value of Access-Control-Allow-Origin?
*
```

### 3d. Test with NO Origin header

```bash
curl -sI https://httpbin.org/get | grep -i "access-control"
```

```
Did the server send any CORS headers?
yes 
Why or why not?
because it being the lazy testing tool 
```

---

## Exercise 4: Debug These CORS Errors

You're a developer and you see these errors in the browser console. Diagnose the problem and write the fix (what header the **server** needs to add/change).

### 4a.

```
❌ Access to fetch at 'https://api.myapp.com/data' from origin
   'https://dashboard.myapp.com' has been blocked by CORS policy:
   No 'Access-Control-Allow-Origin' header is present on the
   requested resource.
```

```
Problem: not sent the Access-Control-Allow-Origin with specific allowd origin

Fix (what header to add on the server): add the Access-Control-Allow-Origin: https://dashboard.myapp.com  as origin list in the server
```

### 4b.

```
❌ Access to fetch at 'https://api.myapp.com/data' from origin
   'https://dashboard.myapp.com' has been blocked by CORS policy:
   The value of the 'Access-Control-Allow-Origin' header must not
   be the wildcard '*' when the request's credentials mode is 'include'.
```

The client-side code:
```javascript
fetch("https://api.myapp.com/data", { credentials: "include" });
```

The server responds with:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

```
Problem: allwoing hacker with cross -Origin hacking

Fix (show the corrected server headers): Access-Control-Allow-Origin: * is wrong as the browser think its wrong * as both allow-Origin and allow-credentials cannot be true for all the origins, the hacker can do any method on the site with wwww.evil.com and with user credentials

```

### 4c.

```
❌ Access to fetch at 'https://api.myapp.com/users' from origin
   'https://dashboard.myapp.com' has been blocked by CORS policy:
   Method PATCH is not allowed by Access-Control-Allow-Methods in
   preflight response.
```

The server's current CORS config:
```
Access-Control-Allow-Origin: https://dashboard.myapp.com
Access-Control-Allow-Methods: GET, POST
```

```
Problem: the method not included in the allow-Method list

Fix (show the corrected header): add the method to allow-Methods list

```

### 4d.

```
❌ Access to fetch at 'https://api.myapp.com/data' from origin
   'https://dashboard.myapp.com' has been blocked by CORS policy:
   Request header field x-api-key is not allowed by
   Access-Control-Allow-Headers in preflight response.
```

The client-side code:
```javascript
fetch("https://api.myapp.com/data", {
    headers: { "X-API-Key": "abc123" }
});
```

```
Problem: X-API_Key not Allow-headers not in backend  

Fix (what header to add/change on the server): add Allow-headers list which headers can sent with custom headers list 

```

---

## Exercise 5: Credentials Deep Dive

### 5a. Fill in the table

For each combination, will the browser **allow** the response?

| `Access-Control-Allow-Origin` | `Access-Control-Allow-Credentials` | `credentials` in fetch | Browser allows?|   Why?   |
|-------------------------------|-------------------------------------|------------------------|---------------|------------|
| `*`                           | not set                             | `"omit"` (default)     | yes           |as Creditionals not needed|
| `*`                           | `true`                              | `"include"`            |No             |can acces with evil.com with user id|
| `https://app.com`             | `true`                              | `"include"`            |yes            |same origin and domain|
| `https://app.com`             | not set                             | `"include"`            |no             |cred not specified by the server|
| `https://other.com`           | `true`                              | `"include"`            |yes            |origin & cred allowed|

### 5b. Scenario

Your frontend at `https://dashboard.myapp.com` needs to send cookies to `https://api.myapp.com`. Write out:

1. The JavaScript fetch call (with the correct `credentials` option):

```javascript
// Your code:
fetch(`https://api.myapp.com`,{
    credentials: 'include'
})
```

2. The server response headers needed:

```
// Your headers:
Access-Control-Allow-Origin: https://frontend.com    ← MUST be specific origin
Access-Control-Allow-Credentials: true               ← MUST be true
```

3. Why can't you just use `Access-Control-Allow-Origin: *` here?

```
Your answer: the evil hacker or anyone can send request with the another origin like evil.com with the user creditionals

```

---

## Exercise 6: CORS in System Design

### 6a. Architecture diagram

You're designing a system with:
- Frontend: `https://app.mycompany.com`
- API Gateway: `https://api.mycompany.com`
- 3 microservices behind the gateway (users, orders, payments)

Draw or describe where CORS headers should be configured:   

```
Your answer / diagram:
Browser (app.frontend.com)
    │
    ▼
┌─────────────────────────┐
│   API Gateway / Reverse │    ← CORS headers added HERE
│   Proxy (nginx, Kong,   │       Centralized CORS config
│   AWS API Gateway)      │
└─────────────────────────┘
    │
    ├──► Microservice A (no CORS logic needed) users
    ├──► Microservice B (no CORS logic needed) orders
    └──► Microservice C (no CORS logic needed) payments



```

Should individual microservices handle CORS? Why or why not?

```
Your answer: no because they need to connect to each other they not need to connect to each, where as there is API gateway / Reverse Proxy handles

```

### 6b. CDN caching problem

Your API serves two frontend apps:
- `https://admin.mycompany.com`
- `https://store.mycompany.com`

The API response is cached by a CDN. A request from `admin.mycompany.com` gets cached first. Then `store.mycompany.com` makes the same request and gets the cached response.

What goes wrong? What header fixes it?

```
Problem:
the CDN stores the admin.mycompany.com and returns the same for the store.mycompany.com

Fix (header name and value):
use the Vary: Origin for different domain
Explain why this fixes it:
caching instruction tells the CDN to don't serve the same cached copy to everyone, cache different copy for the each different Origin value you recieve
```

### 6c. Why no CORS?

Your Node.js backend makes an HTTP request to a third-party API:

```javascript
// Running on your server (not in a browser)
const response = await fetch("https://third-party-api.com/data");
```

Does this trigger CORS? Why or why not?
no
```
Your answer: CORS is purly the browser thing

```

---

✅ **Done with exercises?** Mark `11 — CORS` as complete in the main [README.md](../../README.md)!
