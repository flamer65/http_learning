# Lesson 20: Cookies, Sessions & Authentication

🤔 **Why Authentication?**
HTTP is stateless. By default, every request is completely independent. Authentication and state management allow us to securely "remember" users.
Refer back to:
- **Lesson 08**: Cookies & Sessions
- **Lesson 09**: Authentication Methods (Session vs JWT)

### 🍪 Cookies
Cookies are small pieces of data stored on the client.
- **Set a cookie**: `res.cookie('name', 'value', options)`
- **Read a cookie**: Requires `cookie-parser` middleware. Then access via `req.cookies`.

**Important Cookie Options**:
- `httpOnly: true` (Cannot be accessed by JavaScript - prevents XSS)
- `secure: true` (Only sent over HTTPS)
- `sameSite: 'strict'` (Prevents CSRF)
- `maxAge` (Lifespan in ms. Without it, becomes a session cookie - deleted on browser close)

### 📦 Session-based Authentication
Stateful approach. Server stores user state in memory or a database (session store).
- We use `express-session` to manage sessions automatically.
- Server sets a `connect.sid` session cookie.
- `req.session` object is used to read/write session data.

### 🔑 JWT Authentication
Stateless approach. Server issues a JSON Web Token (JWT) which the client stores (usually in memory or secure cookie).
- Client sends token in `Authorization: Bearer <token>` header.
- Server verifies token cryptographically using a secret. No server-side storage needed!
- We use `jsonwebtoken` to `sign()` and `verify()` tokens.

### ⚖️ Session vs JWT

| Feature | Session | JWT |
| --- | --- | --- |
| State | Stateful (server stores session) | Stateless (client stores token) |
| Scalability | Harder (requires shared DB/Redis) | Easier (CPU-bound verification) |
| Revocation | Easy (delete session on server) | Hard (requires token blacklists) |
| Transport | Usually `Set-Cookie` | Usually `Authorization` Header |
