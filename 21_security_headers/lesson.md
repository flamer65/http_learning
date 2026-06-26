# Lesson 21: Security Headers & Middleware 🛡️

In Lesson 05 and Lesson 09 of the theory section, we discussed the importance of securing HTTP communications. We learned about HTTPS, certificates, and various **Security Headers** that instruct the browser to enforce certain security policies.

Now, we'll see how to implement these in Express.js!

## 📝 The "Why": HTTP Security Headers

By default, web servers and frameworks (including Express) often leak information (like `X-Powered-By: Express`) and lack protective headers. Without these headers, your app might be vulnerable to:
- **XSS (Cross-Site Scripting)**
- **Clickjacking** (loading your site in an iframe to trick users)
- **MIME Sniffing**
- **Downgrade Attacks** (using HTTP instead of HTTPS)

Let's review the key headers we want to set:

1. **Strict-Transport-Security (HSTS)**: Forces the browser to use HTTPS.
2. **X-Content-Type-Options**: Prevents MIME-sniffing (`nosniff`).
3. **X-Frame-Options**: Prevents clickjacking by restricting iframes (`DENY` or `SAMEORIGIN`).
4. **Content-Security-Policy (CSP)**: Restricts where resources (scripts, images) can be loaded from.
5. **Referrer-Policy**: Controls how much referrer information is passed to other sites.
6. **Permissions-Policy**: Restricts access to browser features (camera, microphone, etc.).

## 🤔 The "How": Express Middleware

In Express, we can modify the HTTP response headers using middleware before sending the response:

```typescript
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.removeHeader("X-Powered-By");
  next();
});
```

While you *can* set these manually, the industry standard is to use **Helmet**, a collection of middleware functions that set security headers for you automatically.

## 🛡️ Beyond Headers: Rate Limiting & Validation

Security isn't just about headers! We also need to:
1. **Rate Limit**: Protect against brute-force and DoS (Denial of Service) attacks by limiting how many requests a client can make in a given timeframe.
2. **Validate & Sanitize Input**: Never trust client data! We must check for malicious payloads (like SQL injection strings or XSS scripts).

Let's get hands-on and build our defenses! 🚀
