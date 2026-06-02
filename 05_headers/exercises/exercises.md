# Exercises — HTTP Headers

## Exercise 1: Identify the Headers

Look at this raw HTTP exchange and identify each header's purpose:

### Request:
```
GET /api/products?category=electronics HTTP/1.1
Host: shop.example.com
User-Agent: MyApp/1.0
Accept: application/json
Accept-Language: en-US
Accept-Encoding: gzip, deflate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.token123
Cookie: session=abc123; theme=dark
Cache-Control: no-cache
```

| Header          | What does it tell the server?     |
|-----------------|-----------------------------------|
| Host            |the main domain website or website |                                 
| User-Agent      |tells what browser/mobile,device   |                                
| Accept          |What formats client understands    |
| Accept-Language |Preferred languages                |                   
| Accept-Encoding |compression algorithms you support |                                  
| Authorization   |Sends authentication credentials   |                               
| Cookie          |Sends cookies back to the server   |                                
| Cache-Control   |Controls how the response should be cached                                   

### Response:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 2048
Cache-Control: max-age=300
ETag: "abc123def456"
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure
X-RateLimit-Remaining: 95
Access-Control-Allow-Origin: *
```

| Header                         | What does it tell the client?     |
|--------------------------------|-----------------------------------|
| Content-Type                   | application/json; charset=utf-8   |                               
| Content-Length                 | 2048                              |
| Cache-Control                  | the age of the cache max-age=300  |                                
| ETag                           |unique Identifer for the version of the resource                                   
| Set-Cookie                     |store the cookie                   |                 
| X-RateLimit-Remaining          |rate limit for the given resouce method remaing are 95                                  
| Access-Control-Allow-Origin    |which website is allowed to make request to this server                                 

---

## Exercise 2: Send Custom Headers with curl

### 2a. Send a custom Accept header
```bash
curl -H "Accept: application/xml" https://httpbin.org/headers
```
- What does the server see for your Accept header? →  "application/xml"

### 2b. Send Authorization header
```bash
curl -H "Authorization: Bearer my-secret-token-123" https://httpbin.org/headers
```
- What does the server see? →  "Authorization": "Bearer my-secret-token-123",

### 2c. Send multiple custom headers
```bash
curl -H "X-Request-ID: req-001" \
     -H "X-Client-Version: 2.0" \
     -H "Accept-Language: hi-IN" \
     https://httpbin.org/headers
```
- List all custom headers the server received → "Accept-Language": "hi-IN",   "X-Amzn-Trace-Id": "Root=1-6a14a785-352028c061943f3750e4a73c", 
    "X-Client-Version": "2.0"
"it didn't recieve the X-Request-ID: req-001"
### 2d. Check security headers on real sites
```bash
curl -I https://github.com 2>/dev/null | grep -i "strict\|x-frame\|x-content\|content-security"
```
- What security headers does GitHub use? → 
content-security-policy: default-src 'none'; base-uri 'self'; child-src github.githubassets.com github.com/assets-cdn/worker/ github.com/assets/ gist.github.com/assets-cdn/worker/; connect-src 'self' uploads.github.com www.githubstatus.com collector.github.com raw.githubusercontent.com api.github.com github-cloud.s3.amazonaws.com github-production-repository-file-5c1aeb.s3.amazonaws.com github-production-upload-manifest-file-7fdce7.s3.amazonaws.com github-production-user-asset-6210df.s3.amazonaws.com *.rel.tunnels.api.visualstudio.com wss://*.rel.tunnels.api.visualstudio.com github.githubassets.com objects-origin.githubusercontent.com copilot-proxy.githubusercontent.com proxy.individual.githubcopilot.com proxy.business.githubcopilot.com proxy.enterprise.githubcopilot.com *.actions.githubusercontent.com wss://*.actions.githubusercontent.com productionresultssa0.blob.core.windows.net productionresultssa1.blob.core.windows.net productionresultssa2.blob.core.windows.net productionresultssa3.blob.core.windows.net productionresultssa4.blob.core.windows.net productionresultssa5.blob.core.windows.net productionresultssa6.blob.core.windows.net productionresultssa7.blob.core.windows.net productionresultssa8.blob.core.windows.net productionresultssa9.blob.core.windows.net productionresultssa10.blob.core.windows.net productionresultssa11.blob.core.windows.net productionresultssa12.blob.core.windows.net productionresultssa13.blob.core.windows.net productionresultssa14.blob.core.windows.net productionresultssa15.blob.core.windows.net productionresultssa16.blob.core.windows.net productionresultssa17.blob.core.windows.net productionresultssa18.blob.core.windows.net productionresultssa19.blob.core.windows.net github-production-repository-image-32fea6.s3.amazonaws.com github-production-release-asset-2e65be.s3.amazonaws.com insights.github.com wss://alive.github.com wss://alive-staging.github.com api.githubcopilot.com api.individual.githubcopilot.com api.business.githubcopilot.com api.enterprise.githubcopilot.com edge.fullstory.com rs.fullstory.com; font-src github.githubassets.com; form-action 'self' github.com gist.github.com copilot-workspace.githubnext.com objects-origin.githubusercontent.com; frame-ancestors 'none'; frame-src viewscreen.githubusercontent.com notebooks.githubusercontent.com www.youtube-nocookie.com; img-src 'self' data: blob: github.githubassets.com media.githubusercontent.com camo.githubusercontent.com identicons.github.com avatars.githubusercontent.com private-avatars.githubusercontent.com github-cloud.s3.amazonaws.com objects.githubusercontent.com release-assets.githubusercontent.com secured-user-images.githubusercontent.com user-images.githubusercontent.com private-user-images.githubusercontent.com opengraph.githubassets.com marketplace-screenshots.githubusercontent.com copilotprodattachments.blob.core.windows.net/github-production-copilot-attachments/ github-production-user-asset-6210df.s3.amazonaws.com customer-stories-feed.github.com spotlights-feed.github.com explore-feed.github.com objects-origin.githubusercontent.com *.githubusercontent.com images.ctfassets.net/8aevphvgewt8/; manifest-src 'self'; media-src github.com user-images.githubusercontent.com secured-user-images.githubusercontent.com private-user-images.githubusercontent.com github-production-user-asset-6210df.s3.amazonaws.com gist.github.com github.githubassets.com assets.ctfassets.net/8aevphvgewt8/ videos.ctfassets.net/8aevphvgewt8/; script-src github.githubassets.com; style-src 'unsafe-inline' github.githubassets.com; upgrade-insecure-requests; worker-src github.githubassets.com github.com/assets-cdn/worker/ github.com/assets/ gist.github.com/assets-cdn/worker/
---

## Exercise 3: Content-Type Matching

What `Content-Type` header would you use for each body?

| Body Content                                    | Content-Type            |
|-------------------------------------------------|-------------------------|
| `{"name": "Naman", "age": 25}`                  |application/json         |              
| `<html><body>Hello</body></html>`               |text/html                |        
| `name=Naman&age=25`                             |query string             |            
| A PNG image file                                |image/png                |               
| `Just plain text`                               |text/plain               |          
| An XML document                                 |application/xml          |               
| A file upload form                              |multipart/form-data      |                   
| A PDF document                                  |application/pdf          |                

---

## Exercise 4: Cache-Control Scenarios

What `Cache-Control` value would you set for each scenario?

1. A user's profile page that changes frequently:
```
Cache-Control: no-cache, max-age=3600
```

2. A static logo image that rarely changes (cache for 1 year):
```
Cache-Control: max-age= 1 year * 30 * 12 * 24 * 60 * 60
```

3. A banking page with sensitive data (never cache):
```
Cache-Control: no-store, max-age=0
```

4. An API response that's valid for 5 minutes:
```
Cache-Control: max-age=300
```

---

## Exercise 5: Authorization Headers

### 5a. Basic Auth
Basic auth encodes `username:password` in Base64.

```bash
# Encode "naman:password123" in Base64
echo -n "naman:password123" | base64
```
What's the output? → 
bmFtYW46cGFzc3dvcmQxMjM=
Now send it:
```bash
curl -H "Authorization: Basic <your-base64-string>" https://httpbin.org/headers
```

### 5b. Bearer Token
```bash
curl -H "Authorization: Bearer my-jwt-token-abc123" https://httpbin.org/headers
```
- Can you see the token in the response? → this what I recieve  "Authorization": "Bearer my-jwt-token-abc123", 

### 5c. Why is Basic Auth insecure?
```
Your answer: the time validaty of the basic auth and were static for given email and user, were as like the jwt changes with time and encoding with same user and with evey login request


```

---

## Exercise 6: CORS Headers

You have a frontend at `https://myapp.com` trying to fetch from `https://api.example.com`.

1. What header does the browser automatically send?
```
Answer: Origin
```

2. What header must the server respond with to allow the request?
```
Answer: Access-Control-Allow-Origin : *
```

3. If the server responds with `Access-Control-Allow-Origin: https://other.com`, what happens?
```
Answer: Cors error and block frontend code from reading the reponse
```

---

✅ **Done with exercises?** Mark `05 — Headers` as complete in the main [README.md](../README.md)!
