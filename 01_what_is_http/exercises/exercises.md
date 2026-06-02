# Exercises — What is HTTP?

## Exercise 1: Your First curl Request

Run this command and observe the output:

```bash
curl -v https://httpbin.org/get
```

**Tasks:**
- [ ] Identify the HTTP version being used
- [ ] Find the status code in the response
- [ ] List 3 request headers that curl sent
- [ ] List 3 response headers you received

Write your answers below:

```
HTTP Version: 2
Status Code: 200 OK
Request Headers:
  1. Host: httpbin.org
  2. User-Agent: curl/8.7.1
  3. Accept: */*
Response Headers:
  1. date: Sun, 24 May 2026 13:03:29 GMT
  2. content-length: 255
  3. server: gunicorn/19.9.0
  4. access-control-allow-origin: *
  5. access-control-allow-credentials: true
```

---

## Exercise 2: Read Raw HTTP

Look at this raw HTTP request and answer the questions:

```
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer abc123
Content-Length: 42

{"name": "Naman", "role": "developer"}
```

**Tasks:**
- [ ] What HTTP method is being used?  Post
- [ ] What is the path/endpoint? /api/users
- [ ] What HTTP version is this? HTTP/1.1
- [ ] How many headers are there? List them. host, content-type, authorization, content-length
- [ ] What is the request body? {"name": "Naman", "role": "developer"}
- [ ] What does the Content-Type header tell the server? The data send in the body is in json format.

Write your answers below:

```
Method:  post
Path:  /api/users
HTTP Version:  HTTP/1.1
Number of Headers:  4
Headers:
  1. host: example.com
  2. content-type: application/json
  3. authorization: Bearer abc123
  4. content-length: 42
Body: {"name": "Naman", "role": "developer"}
Content-Type tells server: The data send in the body is in json format.
```

---

## Exercise 3: Browser DevTools

1. Open Chrome/Safari/Firefox
2. Open DevTools → Network tab (Cmd + Option + I → Network)
3. Go to `https://httpbin.org/get`
4. Click on the request in the Network tab

**Tasks:**
- [ ] Screenshot or write down the Request Headers you see
- [ ] Screenshot or write down the Response Headers you see
- [ ] What is the Content-Type of the response?
- [ ] What is the status code?


Write your observations below:

```
Request Headers I found:
1. Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
2. Accept-Encoding: gzip, deflate, br
3. Accept-Language: en-AU,en;q=0.9
4. Connection: keep-alive
5. Host: httpbin.org
6. Sec-Fetch-Dest: document
7. Sec-Fetch-Mode: navigate
8. Sec-Fetch-Site: none
9. User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15

---- For brave 
there are three headers General headers, response headers and request headers 
this is the request header 
:authority: httpbin.org
:method:  GET
:path: /get
:scheme: https

accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
accept-encoding: gzip, deflate, br, zstd
accept-language: en-GB,en;q=0.9
cache-control: max-age=0
priority: u=0, i
sec-ch-ua: "Chromium";v="148", "Brave";v="148", "Not/A)Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
sec-fetch-dest: document
sec-fetch-mode: navigate
sec-fetch-site: none
sec-fetch-user: ?1
sec-gpc: 1
upgrade-insecure-requests: 1
user-agent:
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36

Response Headers I found:
Content-Type: application/Json
Status Code: 200 OK
```

---

## Exercise 4: Compare HTTP Versions

Run these two commands:

```bash
# Force HTTP/1.1
curl -v --http1.1 https://httpbin.org/get

# Allow HTTP/2
curl -v --http2 https://httpbin.org/get
```

**Tasks:**
- [ ] What differences do you notice between HTTP/1.1 and HTTP/2 output?
- [ ] How do the headers look different?


Write your observations below:
> GET /get HTTP/1.1
> Host: httpbin.org
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Sun, 24 May 2026 13:24:18 GMT
< Content-Type: application/json
< Content-Length: 255
< Connection: keep-alive
< Server: gunicorn/19.9.0
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Credentials: true

----- for the http 2 
* [HTTP/2] [1] [:method: GET]
* [HTTP/2] [1] [:scheme: https]
* [HTTP/2] [1] [:authority: httpbin.org]
* [HTTP/2] [1] [:path: /get]
* [HTTP/2] [1] [user-agent: curl/8.7.1]
* [HTTP/2] [1] [accept: */*]
> GET /get HTTP/2
> Host: httpbin.org
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/2 502 
< server: awselb/2.0
< date: Sun, 24 May 2026 13:24:45 GMT
< content-type: text/html
< content-length: 122
< 
<html>
<head><title>502 Bad Gateway</title></head>
<body>
<center><h1>502 Bad Gateway</h1></center>
</body>
</html>
* Connection #0 to host httpbin.org left intact
```
Differences I noticed:


```

---

✅ **Done with exercises?** Mark `01 — What is HTTP?` as complete in the main [README.md](../README.md)!
