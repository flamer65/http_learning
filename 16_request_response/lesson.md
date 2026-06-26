# Lesson 16: Request & Response Deep Dive

Welcome to Lesson 16! In previous lessons (04 Status Codes, 05 Headers, 07 Req/Res Body), we learned about the structure of HTTP messages. Now we'll see how Express exposes these concepts through its `req` and `res` objects.

## 📥 The Request Object (`req`)
Express parses incoming HTTP requests and populates the `req` object.
- `req.body`: Parsed body (requires middleware like `express.json()`).
- `req.headers`: Dictionary of headers.
- `req.get(header)`: Gets a specific header (case-insensitive).
- `req.ip`: The client's IP address.
- `req.method`: The HTTP method (GET, POST, etc.).
- `req.path`: The URL path.

## 📤 The Response Object (`res`)
- `res.status(code)`: Sets the status code.
- `res.json(obj)`: Sends a JSON response and sets `Content-Type: application/json`.
- `res.send(data)`: Sends a response of various types and infers the `Content-Type`.
- `res.set(header, value)`: Sets an HTTP header.
- `res.redirect(status, url)`: Sends a 3xx redirect.
- `res.format(obj)`: Performs Content Negotiation based on the client's `Accept` header.

## 🤝 Content Negotiation
Clients use the `Accept` header to tell the server what format they want (e.g., `application/json` vs `text/plain`). Express's `res.format()` makes it easy to serve different representations of the same resource.

## 📦 Body Parsers
We must tell Express how to parse request bodies using middleware:
- `express.json()` parses `application/json`.
- `express.urlencoded({ extended: true })` parses form submissions (`application/x-www-form-urlencoded`).
