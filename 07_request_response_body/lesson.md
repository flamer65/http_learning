# 07 — Request & Response Body

## 🤔 What is the Body?

The **body** is the actual data payload of an HTTP message. It comes after the headers (separated by an empty line).

- **Request body** → Data YOU send to the server (POST, PUT, PATCH)
- **Response body** → Data the SERVER sends back to you

```
Headers here...
Content-Type: application/json
                                  ← empty line
{"this": "is the body"}          ← BODY starts here
```

> **GET and DELETE** usually don't have a body.
> **POST, PUT, PATCH** usually have a body.

---

## 📦 Common Body Formats

### 1. JSON (Most Common for APIs)

```
Content-Type: application/json
```

```json
{
  "name": "Naman",
  "age": 25,
  "skills": ["HTTP", "Go", "JavaScript"],
  "address": {
    "city": "Delhi",
    "country": "India"
  }
}
```

```bash
# Send JSON body
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman", "skill": "HTTP"}'
```

### 2. Form URL-Encoded (HTML Forms)

```
Content-Type: application/x-www-form-urlencoded
```

```
name=Naman&age=25&city=Delhi
```

- Same format as URL query parameters
- Default for HTML `<form>` submissions

```bash
# Send form data
curl -X POST https://httpbin.org/post \
  -d "name=Naman&age=25&city=Delhi"
# curl uses form-urlencoded by default when you use -d without -H
```

### 3. Multipart Form Data (File Uploads)

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

Naman
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

(binary file data here)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

- Each field is separated by a **boundary** string
- Can contain both text fields AND binary files

```bash
# Upload a file (create a test file first)
echo "Hello World" > /tmp/test.txt
curl -X POST https://httpbin.org/post \
  -F "username=Naman" \
  -F "file=@/tmp/test.txt"
```

### 4. Plain Text

```
Content-Type: text/plain
```

```
Just a simple text message.
No structure, no encoding.
```

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: text/plain" \
  -d "Hello, this is plain text"
```

### 5. XML

```
Content-Type: application/xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>Naman</name>
  <age>25</age>
  <city>Delhi</city>
</user>
```

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?><user><name>Naman</name></user>'
```

### 6. Binary Data (Images, PDFs, etc.)

```
Content-Type: application/octet-stream
Content-Type: image/png
Content-Type: application/pdf
```

---

## 📊 Format Comparison

| Format           | Content-Type                          | Use Case                     | Readable? |
|------------------|---------------------------------------|------------------------------|-----------|
| JSON             | `application/json`                    | APIs, modern web             | ✅        |
| Form URL-Encoded | `application/x-www-form-urlencoded`   | HTML forms, simple data      | ✅        |
| Multipart        | `multipart/form-data`                 | File uploads                 | ⚠️        |
| Plain Text       | `text/plain`                          | Simple messages, logs        | ✅        |
| XML              | `application/xml`                     | Legacy APIs, SOAP            | ✅        |
| Binary           | `application/octet-stream`            | Files, images                | ❌        |

---

## 📥 Response Bodies

The server can respond with any format. Common response body types:

### JSON Response (API)
```json
{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Naman",
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

### HTML Response (Web Page)
```html
<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body><h1>Hello Naman!</h1></body>
</html>
```

### Empty Body
Some responses have NO body:
- `204 No Content` (after DELETE)
- `304 Not Modified` (use cached version)
- `HEAD` requests (headers only)

---

## 📏 Content-Length & Transfer-Encoding

### Content-Length
```
Content-Length: 42
```
- Tells exactly how many bytes the body is
- Client knows when it has received everything

### Transfer-Encoding: chunked
```
Transfer-Encoding: chunked
```
- Body is sent in **chunks** of varying size
- Used when the server doesn't know the total size upfront (streaming)

```
4\r\n        ← chunk size (4 bytes)
Wiki\r\n     ← chunk data
5\r\n        ← chunk size (5 bytes)
pedia\r\n    ← chunk data
0\r\n        ← chunk size 0 = end
\r\n         ← end of message
```

---

## 🗜 Content-Encoding (Compression)

```
Content-Encoding: gzip
```

Responses are often **compressed** to save bandwidth:
- Client sends: `Accept-Encoding: gzip, deflate, br`
- Server compresses the body and sets `Content-Encoding: gzip`
- Client decompresses before using the data

```bash
# See compressed vs uncompressed size
curl -s -H "Accept-Encoding: gzip" https://httpbin.org/gzip | wc -c
curl -s https://httpbin.org/gzip | wc -c
```

---

## 🧪 Try It Yourself

```bash
# 1. Send JSON and see what server receives
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman", "learning": "HTTP"}'

# 2. Send form data
curl -X POST https://httpbin.org/post \
  -d "name=Naman&skill=HTTP&level=beginner"

# 3. Upload a file
echo "My test file content" > /tmp/testfile.txt
curl -X POST https://httpbin.org/post \
  -F "description=Test upload" \
  -F "file=@/tmp/testfile.txt"

# 4. See different response types
curl https://httpbin.org/json     # JSON response
curl https://httpbin.org/html     # HTML response
curl https://httpbin.org/xml      # XML response

# 5. Check content length
curl -I https://httpbin.org/get
```

---

## 📝 Key Takeaways

- The body carries the actual data in HTTP messages
- `Content-Type` header tells how to interpret the body
- JSON is the most common format for modern APIs
- Form URL-encoded is used by HTML forms
- Multipart form data is used for file uploads
- Responses can be compressed (gzip) to save bandwidth
- Not all requests/responses have a body (GET, DELETE, 204, 304)

---

**← Previous:** [06 — Request & Response Cycle](../06_request_response_cycle/lesson.md)
**Next →** [08 — Cookies & Sessions](../08_cookies_and_sessions/lesson.md)
