# Exercises — Request & Response Body

## Exercise 1: Send Different Body Formats

### 1a. JSON Body
```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"username": "naman", "email": "naman@test.com", "age": 25}'
```

Look at the response. Answer:
- What field shows your parsed JSON? → "json": {
    "age": 25, 
    "email": "naman@test.com", 
    "username": "naman"
  },
- What does `Content-Type` show in request headers? → "application/json"

### 1b. Form URL-Encoded Body
```bash
curl -X POST https://httpbin.org/post \
  -d "username=naman&email=naman@test.com&age=25"
```

- What field shows your form data? →   "form": {
    "age": "25", 
    "email": "naman@test.com", 
    "username": "naman"
  }, 
- What `Content-Type` did curl automatically set? → application/x-www-form-urlencoded
- How does this differ from the JSON example? → the form uses the url encoding and where as the json is speratly sent through the body and content is set to  application/x-www-form-urlencoded

### 1c. Multipart Form Data
```bash
echo "This is a test file for HTTP learning" > /tmp/http_test.txt
curl -X POST https://httpbin.org/post \
  -F "username=naman" \
  -F "description=Learning HTTP" \
  -F "file=@/tmp/http_test.txt"
```

- Where does the file content appear? →   "files": {
    "file": "This is a test file for HTTP learning\n"
  }, 

- Where do the text fields appear? →   "form": {
    "description": "Learning HTTP", 
    "username": "naman"
  }, 
- What does the Content-Type header look like? → "multipart/form-data; boundary=------------------------fzw88mzbVz6PxUX8DcemQy",

---

## Exercise 2: Read Different Response Bodies

```bash
# JSON response
curl -s https://httpbin.org/json | head -20

# HTML response
curl -s https://httpbin.org/html | head -20

# XML response
curl -s https://httpbin.org/xml | head -20
```

For each response, note:
```
JSON:
  - What Content-Type does the server set? application/json
  - Can you read it easily? yes

HTML:
  - What Content-Type does the server set? text/html; charset=utf-8
  - What HTML tags do you see? <!DOCTYPE html>
<html>
  <head>
  </head>
  <body><h1>, <div>
        <p>

XML:
  - What Content-Type does the server set?  application/xml
  - How does it differ from JSON? the format of the body its shared thorugh the xml
```

---

## Exercise 3: Content-Length Investigation

```bash
# Check content length for different endpoints
curl -sI https://httpbin.org/get | grep -i content-length
curl -sI https://httpbin.org/html | grep -i content-length
curl -sI https://httpbin.org/json | grep -i content-length
```

```
/get content length:  256___ bytes
/html content length:3741___ bytes
/json content length: 429___ bytes

Which endpoint returns the most data? the html
```

---

## Exercise 4: Build a JSON Payload

Create JSON payloads for these scenarios:

### 4a. Create a new user
```json
// What JSON would you send to POST /api/users?
{
  "name": "naman",
  "age": 45,
  "email": "example@gmail.com"
}

```

### 4b. Create a blog post
```json
// What JSON would you send to POST /api/posts?
{
  "blog": "today is Tuesday maorning live"
}

```

### 4c. Update a user's address (partial update)
```json
// What JSON would you send to PATCH /api/users/42?
{
  "address": "Gurugram"
}

```
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"username": "naman", "email": "naman@test.com", "age": 25}'
Now send one of them using curl:
```bash
# Your curl command here:
curl -X POST https://httpbin.org/api/users \
   -H "Content-Type: application/json" \
   -d '{ "name": "naman", "age": 45,"email": "example@gmail.com"}'

curl -X  POST https://httpbin.org/api/posts \
     -H "Content-Type: application/json" \
    -d   '{"blog": "today is Tuesday maorning live"}'

curl -X PATCH https://httpbin.org/api/users/42 \
     -H "Content-Type: application/json" \
     -d '{"address": "Gurugram"}'
```

---

## Exercise 5: Form vs JSON

You're building a login endpoint. Compare sending credentials in both formats:

### Form format:
```bash
curl -X POST https://httpbin.org/post \
  -d "username=naman&password=secret123"
```

### JSON format:
```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"username": "naman", "password": "secret123"}'
```

Compare the responses:
```
Form — where does the data appear in response?
 "form": {
    "password": "secret123", 
    "username": "naman"
  }, 

JSON — where does the data appear in response?
  "json": {
    "password": "secret123", 
    "username": "naman"
  }, 


When would you use form format vs JSON?

```

---

## Exercise 6: Compression

```bash
# Request with gzip support
curl -s -H "Accept-Encoding: gzip" https://httpbin.org/gzip

# Check the response
curl -sI -H "Accept-Encoding: gzip" https://httpbin.org/gzip | grep -i "content-encoding\|content-length"
```

```
Is the response compressed? content-length: 215
content-encoding: gzip --yes 
Content-Encoding header value: gzip
Why do we compress HTTP bodies? for faster bandwidth
```

---

✅ **Done with exercises?** Mark `07 — Request & Response Body` as complete in the main [README.md](../README.md)!
