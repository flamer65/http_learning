# 06 — The Request & Response Cycle

## 🤔 What Happens When You Type a URL?

Let's trace the **complete journey** of an HTTP request, step by step.

```
 ┌─────────┐                                           ┌─────────┐
 │ Browser │  ──── DNS ────> IP Address                │         │
 │ (Client)│  ──── TCP ────> Connection Established    │ Server  │
 │         │  ──── TLS ────> Encryption Set Up (HTTPS) │         │
 │         │  ──── HTTP ───> Request Sent              │         │
 │         │  <─── HTTP ───  Response Received         │         │
 └─────────┘                                           └─────────┘
```

---

## 📡 Step 1: DNS Resolution

Your browser doesn't know what `www.google.com` is. It needs an **IP address**.

```
www.google.com  ──DNS──>  142.250.193.100
```

**DNS Lookup Chain:**
1. **Browser cache** — Have I looked this up recently?
2. **OS cache** — Has my computer looked this up?
3. **Router cache** — Has my router looked this up?
4. **ISP's DNS server** — Ask the internet service provider
5. **Root DNS → TLD DNS → Authoritative DNS** — Full lookup

```bash
# See DNS resolution in action
nslookup www.google.com

# More detailed
dig www.google.com

# See which IP you're connecting to
curl -v https://www.google.com 2>&1 | grep "Trying"
```

---

## 🔌 Step 2: TCP Connection (Three-Way Handshake)

HTTP uses **TCP** for reliable communication. Before any data is sent, a TCP connection must be established.

```
Client                    Server
  │                          │
  │──── SYN ──────────────>  │  "Hey, want to connect?"
  │                          │
  │<───── SYN-ACK ─────────  │  "Sure, let's connect!"
  │                          │
  │──── ACK ──────────────>  │  "Great, we're connected!"
  │                          │
  │   Connection Established │
```

- **SYN** = Synchronize (client initiates)
- **SYN-ACK** = Server acknowledges and agrees
- **ACK** = Client confirms

> This happens every time you make an HTTP/1.0 request. HTTP/1.1 uses **keep-alive** to reuse connections.

---

## 🔐 Step 3: TLS Handshake (HTTPS only)

If using HTTPS, a **TLS handshake** happens after TCP to set up encryption.

```
Client                         Server
  │                              │
  │── Client Hello ────────────>│  (supported ciphers, TLS version)
  │                              │
  │<── Server Hello ────────────│  (chosen cipher, server certificate)
  │                              │
  │── Verify Certificate ──────>│  (check if cert is valid & trusted)
  │                              │
  │── Key Exchange ────────────>│  (agree on encryption keys)
  │                              │
  │   Encrypted Connection Ready │
```

```bash
# See TLS handshake details
curl -v https://www.google.com 2>&1 | grep -A5 "SSL connection\|TLS\|certificate"
```

---

## 📤 Step 4: HTTP Request

Now the browser sends the actual HTTP request:

```
GET /search?q=http+tutorial HTTP/1.1       ← Request Line
Host: www.google.com                        ← Headers
User-Agent: Mozilla/5.0 (Mac)
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Cookie: NID=abc123; SID=xyz789
                                            ← Empty line (end of headers)
                                            ← No body for GET
```

### Request Structure:
```
┌─────────────────────────────────────┐
│ Request Line                        │  METHOD  PATH  HTTP_VERSION
├─────────────────────────────────────┤
│ Headers                             │  Key: Value pairs
│ Host: ...                           │
│ User-Agent: ...                     │
│ Accept: ...                         │
│ ...                                 │
├─────────────────────────────────────┤
│ (empty line)                        │  Separates headers from body
├─────────────────────────────────────┤
│ Body (optional)                     │  Data for POST/PUT/PATCH
└─────────────────────────────────────┘
```

---

## 🖥 Step 5: Server Processing

The server receives your request and:

1. **Parses** the request (method, path, headers, body)
2. **Routes** to the correct handler (e.g., `/search` → SearchController)
3. **Authenticates** (checks cookies/tokens if needed)
4. **Processes** the business logic (search the database, compute results)
5. **Generates** the response (HTML, JSON, etc.)

```
Request
   │
   ├── Web Server (Nginx/Apache) ← Receives connection
   │     │
   │     ├── Reverse Proxy/Load Balancer ← Distributes load
   │     │     │
   │     │     ├── Application Server (Node.js/Go/Python)
   │     │     │     │
   │     │     │     ├── Middleware (auth, logging, CORS)
   │     │     │     │     │
   │     │     │     │     ├── Route Handler
   │     │     │     │     │     │
   │     │     │     │     │     ├── Database Query
   │     │     │     │     │     │
   │     │     │     │     │     └── Build Response
```

---

## 📥 Step 6: HTTP Response

Server sends back the response:

```
HTTP/1.1 200 OK                            ← Status Line
Content-Type: text/html; charset=UTF-8     ← Headers
Content-Length: 45678
Content-Encoding: gzip
Cache-Control: private, max-age=0
Set-Cookie: PREF=f6=40000000; path=/
Date: Sat, 24 May 2026 10:00:00 GMT
                                           ← Empty line
<!DOCTYPE html>                            ← Body starts
<html>
<head><title>http tutorial - Google Search</title></head>
<body>... search results ...</body>
</html>
```

### Response Structure:
```
┌─────────────────────────────────────┐
│ Status Line                         │  HTTP_VERSION  STATUS_CODE  REASON
├─────────────────────────────────────┤
│ Headers                             │  Key: Value pairs
│ Content-Type: ...                   │
│ Content-Length: ...                 │
│ Set-Cookie: ...                     │
│ ...                                 │
├─────────────────────────────────────┤
│ (empty line)                        │  Separates headers from body
├─────────────────────────────────────┤
│ Body                                │  The actual content (HTML/JSON/etc.) 
└─────────────────────────────────────┘
```

---

## 🖼 Step 7: Browser Rendering

After receiving the HTML, the browser:

1. **Parses HTML** → Builds the DOM (Document Object Model)
2. **Discovers resources** → Finds CSS, JS, images in the HTML
3. **Sends more HTTP requests** for each resource (CSS, JS, images, fonts)
4. **Parses CSS** → Builds the CSSOM
5. **Executes JavaScript**
6. **Renders** the page (combines DOM + CSSOM → paint pixels)

```
HTML received
  │
  ├── Parse HTML → DOM tree
  │     │
  │     ├── Found <link href="style.css"> → HTTP request for CSS
  │     ├── Found <script src="app.js">   → HTTP request for JS
  │     ├── Found <img src="logo.png">    → HTTP request for image
  │     │
  │     └── All resources loaded
  │           │
  │           ├── Build CSSOM
  │           ├── Build Render Tree (DOM + CSSOM)
  │           ├── Layout (calculate positions)
  │           └── Paint (draw pixels on screen)
```

---

## 🔄 Connection Management

### HTTP/1.0 — One request per connection
```
Connect → Request → Response → Close
Connect → Request → Response → Close  (new connection every time!)
```

### HTTP/1.1 — Keep-Alive (reuse connections)
```
Connect → Request → Response → Request → Response → ... → Close
```

### HTTP/2 — Multiplexing (multiple requests on one connection)
```
Connect → Request1 ──────> ← Response1
          Request2 ──────> ← Response2  (all at the same time!)
          Request3 ──────> ← Response3
```

---

## 🧪 Try It Yourself

### See the full cycle with curl
```bash
# See everything: DNS, TCP, TLS, Request, Response
curl -v --trace-time https://httpbin.org/get

# See timing breakdown of each phase
curl -w "\nDNS: %{time_namelookup}s\nTCP: %{time_connect}s\nTLS: %{time_appconnect}s\nFirst Byte: %{time_starttransfer}s\nTotal: %{time_total}s\n" \
     -o /dev/null -s https://www.google.com
```

### Watch it in Browser DevTools
1. Open Chrome → DevTools (Cmd+Option+I) → Network tab
2. Visit any website
3. Click on a request → look at:
   - **Headers** tab → Request & Response headers
   - **Timing** tab → See DNS, TCP, TLS, Request/Response timing
   - **Preview/Response** tab → See the response body

---

## 📝 Key Takeaways

- The full cycle: DNS → TCP → TLS → Request → Server Processing → Response → Rendering
- TCP uses a 3-way handshake to establish connections
- TLS adds encryption on top of TCP (HTTPS)
- An HTTP request has: request line, headers, body
- An HTTP response has: status line, headers, body
- Loading a web page triggers MANY HTTP requests (HTML, CSS, JS, images)
- HTTP/2 makes this faster with multiplexing

---

**← Previous:** [05 — Headers](../05_headers/lesson.md)
**Next →** [07 — Request & Response Body](../07_request_response_body/lesson.md)
