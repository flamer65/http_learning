# 01 — What is HTTP?

## 🤔 What Does HTTP Stand For?

**HTTP = HyperText Transfer Protocol**

It's the **rules/protocol** that your browser and a server follow to talk to each other. Every time you open a website, your browser sends an HTTP request to a server, and the server sends back an HTTP response.

```
You (Browser)  ----HTTP Request--->   Server (google.com)
You (Browser)  <---HTTP Response---   Server (google.com)
```

## 📜 Brief History

| Version    | Year | Key Feature                                |
|------------|------|--------------------------------------------|
| HTTP/0.9   | 1991 | Only GET method, no headers                |
| HTTP/1.0   | 1996 | Headers, status codes, POST method         |
| HTTP/1.1   | 1997 | Persistent connections, chunked transfer   |
| HTTP/2     | 2015 | Multiplexing, binary protocol, server push |
| HTTP/3     | 2022 | Uses QUIC (UDP based), faster              |

## 🧱 How the Web Works (Simplified)

1. You type `https://www.google.com` in your browser
2. Browser looks up the **IP address** of `google.com` using **DNS**
3. Browser establishes a **TCP connection** with that IP
4. Browser sends an **HTTP request** (like "give me the homepage")
5. Server processes the request
6. Server sends back an **HTTP response** (HTML, CSS, JS, images, etc.)
7. Browser **renders** the HTML and shows you the page

## 📦 What's Inside an HTTP Message?

Every HTTP message (request or response) has two parts:

### Request
```
GET /search?q=hello HTTP/1.1        ← Request Line (method, path, version)
Host: www.google.com                ← Headers start here
User-Agent: Mozilla/5.0
Accept: text/html
                                    ← Empty line (separates headers from body)
                                    ← Body (empty for GET requests)
```

### Response
```
HTTP/1.1 200 OK                     ← Status Line (version, status code, reason)
Content-Type: text/html             ← Headers
Content-Length: 12345
Date: Sat, 24 May 2026 10:00:00 GMT
                                    ← Empty line
<!DOCTYPE html>                     ← Body (the actual content)
<html>...
```

## 🔑 Key Concepts to Remember

1. **HTTP is stateless** — Each request is independent. The server doesn't remember your previous requests (that's why cookies exist).
2. **HTTP is a text-based protocol** (HTTP/1.1) — You can literally read the raw messages.
3. **Client-Server model** — Client (browser) initiates, server responds.
4. **HTTP uses TCP** (HTTP/1.1 and HTTP/2) — Reliable, ordered delivery.

## 🧪 Try It Yourself

Open your terminal and run:

```bash
# Make your first HTTP request using curl
curl -v https://httpbin.org/get
```

The `-v` flag shows you the **verbose** output — you'll see the actual request headers your machine sent and the response headers you got back.

### What to notice in the output:
- Lines starting with `>` are what **you sent** (request)
- Lines starting with `<` are what **you received** (response)
- Look for the `HTTP/2 200` status line

---

## 📝 Key Takeaways

- HTTP is the protocol browsers use to communicate with servers
- It follows a request → response pattern
- Messages have a start line, headers, and optionally a body
- HTTP is stateless — each request is independent
- You can inspect HTTP traffic using `curl -v` or browser DevTools

---

**Next →** [02 — URLs & URIs](../02_urls_and_uris/lesson.md)
