# Exercises — HTTP Methods

## Exercise 1: Method Matching

Match each scenario to the correct HTTP method:

| # | Scenario                                          | Method |
|---|---------------------------------------------------|--------|
| 1 | Fetch a list of all products                      | Get    |
| 2 | Create a new blog post                            | Post   |
| 3 | Change only the title of an existing post         | Patch  |
| 4 | Replace an entire user profile                    | Put    |
| 5 | Delete a comment                                  | Delete |
| 6 | Check if an image exists without downloading it   | HEAD   |
| 7 | Check which methods a server endpoint supports    | OPTIONS|
| 8 | Upload a new profile picture                      | Post   |
| 9 | Update a user's email address only                | Patch  |
| 10| Get the homepage of a website                     | Get    |

---

## Exercise 2: Hands-On with curl

Run each of these curl commands and observe the response. Pay attention to the `method` field in the JSON response.

### 2a. GET Request
```bash
curl https://httpbin.org/get
```
What method does the response show? → GET

### 2b. POST Request with JSON
```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"username": "naman", "password": "secret123"}'
```
- What's in the `json` field of the response? → '{"username": "naman", "password": "secret123"}'
- What's in the `headers.Content-Type`? → application/json

### 2c. PUT Request
```bash
curl -X PUT https://httpbin.org/put \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman", "email": "naman@test.com", "age": 25}'
```
- What data does the server see? → {"name": "Naman", "email": "naman@test.com", "age": 25} as Put request with content-type: application/json

### 2d. PATCH Request
```bash
curl -X PATCH https://httpbin.org/patch \
  -H "Content-Type: application/json" \
  -d '{"age": 26}'
```
- How is this different from the PUT request above? → only updates the age in the response, email and name are not sent so not updated

### 2e. DELETE Request
```bash
curl -X DELETE https://httpbin.org/delete
```
- Did you send any body? → no

### 2f. HEAD Request
```bash
curl -I https://httpbin.org/get
```
- Did you get a body back? →  HTTP/2 200 
date: Mon, 25 May 2026 07:44:15 GMT
content-type: application/json
content-length: 255
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true


---

## Exercise 3: Idempotency Test

Think about these scenarios and answer:

1. You send `POST /api/orders` with `{"item": "book", "qty": 1}` three times. How many orders are created?
```
Answer: 3 times
```

2. You send `PUT /api/users/1` with `{"name": "Naman"}` three times. What's the final state?
```
Answer: {"name": "Naman"}
```

3. You send `DELETE /api/posts/5` three times. What happens on the 2nd and 3rd calls?
```
Answer: same result as the data is deleted on first call and on the second call we get a error for not found resource.
```

---

## Exercise 4: PUT vs PATCH

Given this existing resource:
```json
{
  "id": 1,
  "name": "Naman",
  "email": "naman@example.com",
  "role": "user",
  "active": true
}
```

What would the resource look like after each request?

### 4a. `PUT /users/1` with body `{"name": "Naman G", "email": "ng@example.com"}`
```json
Result: {
  "id": 1,
  "name": "Naman G",
  "email": "ng@example.com"
}

```

### 4b. `PATCH /users/1` with body `{"name": "Naman G"}`
```json
Result:{
  "id": 1,
  "name": "Naman G",
  "email": "naman@example.com",
  "role": "user",
  "active": true
}

```

### 4c. `PUT /users/1` with body `{"name": "Naman G", "email": "ng@example.com", "role": "admin", "active": true}`
```json
Result:{"name": "Naman G", "email": "ng@example.com", "role": "admin", "active": true}

```

---

## Exercise 5: Design an API

You're building a simple **Todo List API**. Design the endpoints using proper HTTP methods:

| Action                  | Method | URL Path         |
|-------------------------|--------|------------------|
| Get all todos           | Get    | /todos           |
| Get a specific todo     | Get    | /todos/:id       |
| Create a new todo       | Post   | /todos           |
| Mark a todo as complete | Patch  | /todos/:id       |
| Update entire todo      | Put    | /todos/:id       |
| Delete a todo           | Delete | /todos/:id       |

---

✅ **Done with exercises?** Mark `03 — HTTP Methods` as complete in the main [README.md](../README.md)!
