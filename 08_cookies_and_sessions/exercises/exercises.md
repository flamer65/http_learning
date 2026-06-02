# Exercises — Cookies & Sessions

## Exercise 1: Set and Read Cookies with curl

### 1a. Set a cookie using httpbin
```bash
curl -v https://httpbin.org/cookies/set/username/naman 2>&1 | grep -i "set-cookie\|location"
```

What `Set-Cookie` header did you receive?
```
Answer: < location: /cookies
< set-cookie: username=naman; Path=/
```

### 1b. Send cookies to a server
```bash
curl -b "username=naman; theme=dark; language=en" https://httpbin.org/cookies
```

What does the server see? 
```
Answer: {
  "cookies": {
    "language": "en", 
    "theme": "dark", 
    "username": "naman"
  }
}
```

### 1c. Save cookies to file and reuse
```bash
# Step 1: Get cookies and save them
curl -c /tmp/my_cookies.txt -L https://httpbin.org/cookies/set/session_id/abc123

# Step 2: See what was saved
cat /tmp/my_cookies.txt

# Step 3: Send saved cookies
curl -b /tmp/my_cookies.txt https://httpbin.org/cookies
```

What cookie was saved? What did the server see when you resent it?
```
Saved cookie: session_id=ab123
Server received: session_id=abc123
```

---

## Exercise 2: Cookie Attributes

For each scenario, write the `Set-Cookie` header with the correct attributes:

### 2a. A session cookie for a banking app (max security)
```
Set-Cookie: Set-Cookie: session_id=abc123; Secure; SameSite=strict; HttpOnly;  Path=/
```
What attributes did you use and why? 

### 2b. A "remember me" cookie that lasts 30 days
```
Set-Cookie: Max-Age=30 days
```

### 2c. A theme preference cookie (dark mode) accessible by JavaScript
```
Set-Cookie: theme=dark
```

### 2d. A tracking cookie that works across all subdomains of example.com
```
Set-Cookie:  tracking_id=xyz123; Domain=example.com; path=/
```

---

## Exercise 3: Understand the Flow

Draw the cookie flow for a login scenario:

```
Step 1: User sends POST /login with {username, password}
  Browser sends:
  raw credentials are send through the (in JSON format) the browser doesnt have any cookie or session_id so the browser doesnt have anything to send. only send required json credentials 
  
Step 2: Server validates credentials and responds
  Server sends: 
  Server Response with "Set-Cookie" header in the response 
  (e.g Set-Cookie: session_id=abc123, Secure, httpOnly) with name-value pair for the session id and browser saves it
  
  
Step 3: User navigates to GET /dashboard
  Browser automatically sends:
  when the user hits or navigates domain GET /dashboard the browser sets the session key value in the header "Cookie" in (Cookie: session_id=abc123) the browser attaches this to the request automatically
  
Step 4: Server checks the cookie and responds
  Server does:
  Looks for the Cookie header in the request checks the database and look for the 'session_id=abc123' matches what is related account and responds with dashboard
  
```

---

## Exercise 4: Session vs Cookie — Which to Use?

For each piece of data, should it be stored in a cookie directly or in a server-side session?

| Data                          | Cookie or Session? | Why?                    |
|-------------------------------|-------------------|-------------------------|
| User's preferred language     |cookie             |Cookie can be passed to the frontend and not required security
| User's email address          |Session            |not requried in any cookie and session_id|                         
| Shopping cart contents        |session            |for large file size and and cannot change price  |
| Admin/user role               |session            |sensitive data not to be avaliable to view|                         
| "Dark mode" preference        |cookie             |not such sensetive and needs to be read by the frontend|
| Credit card token             |session            |senstive not to view in public and large file size|                       
| Last visited page             |cookie             |non sensitive data|

---

## Exercise 5: Cookie Security

### 5a. Why is this cookie insecure?
```
Set-Cookie: role=admin; Path=/
```
```
Your answer: due to the its just cookie and accessable by anyone, no httpOnly can be changed by the js, Secure, strict not used as the cross site attack anyone from third party can access the given role with any path or sub domain of the given main domain


```

### 5b. Why is this cookie insecure?
```
Set-Cookie: session_id=abc123; Path=/
```
(Hint: what attributes are missing?)
```
Your answer: same the above


```

### 5c. Fix this cookie to be secure:
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9.abc123
```
```
Your secure version:
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9.abc123; Secure; HttpOnly; Same-site=stricit
```

---

## Exercise 6: Real-World Cookies

Visit a website and inspect its cookies:

```bash
# See cookies set by Google
curl -v -I https://www.google.com 2>&1 | grep -i "set-cookie"

# See cookies set by GitHub
curl -v -I https://github.com 2>&1 | grep -i "set-cookie"
```

Or use Chrome DevTools → Application tab → Cookies

**Tasks:**
- [ ] List 3 cookies you found
- [ ] For each, identify: Name, HttpOnly?, Secure?, SameSite?
- [ ] Can you guess the purpose of each cookie?

```
Cookie 1:
  Name: AEC
  HttpOnly: HttpOnly 
  Secure: true 
  SameSite: lax
  Purpose: dont but looks like for the all domain and the google link can be clicked by any third party

Cookie 2:
  Name: _Secure-STRP
  HttpOnly: No
  Secure: true
  SameSite: strict
  Purpose: dont know

Cookie 3:
  Name: NID
  HttpOnly: True 
  Secure: true
  SameSite: None
  Purpose: dont know 
```

---

✅ **Done with exercises?** Mark `08 — Cookies & Sessions` as complete in the main [README.md](../README.md)!
