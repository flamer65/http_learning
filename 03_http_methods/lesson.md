# 03 — HTTP Methods

## 🤔 What Are HTTP Methods?

HTTP methods (also called **verbs**) tell the server **what action** you want to perform on a resource.

Think of it like this:
- Resource = a "thing" (user, post, file)
- Method = what you want to "do" with it (get, create, update, delete)

## 📋 The Main HTTP Methods

### GET — "Give me this resource"
```bash
GET /api/users/42 HTTP/1.1
Host: example.com
```
- **Purpose:** Retrieve/read data
- **Has body?** ❌ No (shouldn't have one)
- **Safe?** ✅ Yes (doesn't change anything)
- **Idempotent?** ✅ Yes (same result every time)
- **Use case:** Fetching a user profile, loading a webpage

```bash
# Try it
curl https://httpbin.org/get
```

---

### POST — "Create this new resource"
```bash
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{"name": "Naman", "email": "naman@example.com"}
```
- **Purpose:** Create a new resource / submit data
- **Has body?** ✅ Yes
- **Safe?** ❌ No (creates something new)
- **Idempotent?** ❌ No (calling twice = two resources created)
- **Use case:** Creating a new user, submitting a form, uploading a file

```bash
# Try it
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman", "skill": "HTTP"}'
```

---

### PUT — "Replace this entire resource"
```bash
PUT /api/users/42 HTTP/1.1
Host: example.com
Content-Type: application/json

{"name": "Naman G", "email": "naman@example.com", "role": "admin"}
```
- **Purpose:** Replace/update the entire resource
- **Has body?** ✅ Yes (complete resource)
- **Safe?** ❌ No
- **Idempotent?** ✅ Yes (same result if called multiple times)
- **Use case:** Updating a full user profile

```bash
# Try it
curl -X PUT https://httpbin.org/put \
  -H "Content-Type: application/json" \
  -d '{"name": "Naman G", "email": "naman@example.com", "role": "admin"}'
```

---

### PATCH — "Update part of this resource"
```bash
PATCH /api/users/42 HTTP/1.1
Host: example.com
Content-Type: application/json

{"role": "admin"}
```
- **Purpose:** Partially update a resource (only send what changed)
- **Has body?** ✅ Yes (only the fields to update)
- **Safe?** ❌ No
- **Idempotent?** ⚠️ Can be, but not guaranteed
- **Use case:** Changing just the role of a user

```bash
# Try it
curl -X PATCH https://httpbin.org/patch \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

---

### DELETE — "Remove this resource"
```bash
DELETE /api/users/42 HTTP/1.1
Host: example.com
```
- **Purpose:** Delete a resource
- **Has body?** ❌ Usually no
- **Safe?** ❌ No
- **Idempotent?** ✅ Yes (deleting twice = same result)
- **Use case:** Deleting a user account, removing a post

```bash
# Try it
curl -X DELETE https://httpbin.org/delete
```

---

## 📊 Less Common Methods

### HEAD — "Same as GET, but only give me headers"
```bash
# Only returns headers, no body — useful for checking if resource exists
curl -I https://httpbin.org/get
```
- Same as GET but **no response body**
- Used to check if a resource exists, get content size, etc.

### OPTIONS — "What methods are allowed here?"
```bash
# Ask the server what methods are supported
curl -X OPTIONS https://httpbin.org/ -i
```
- Returns `Allow` header listing supported methods
- Used in **CORS preflight requests** (browsers send this automatically)

### TRACE — "Echo back what you received"
- Diagnostic method — echoes back the request
- Usually **disabled** on production servers (security risk)

### CONNECT — "Establish a tunnel"
- Used for HTTPS through a proxy
- Creates a TCP tunnel (you won't use this directly)

---

## 🔑 Key Properties Explained

### Safe Methods
> Methods that **don't modify** anything on the server.
- `GET`, `HEAD`, `OPTIONS` are **safe**
- `POST`, `PUT`, `PATCH`, `DELETE` are **not safe**

### Idempotent Methods
> Calling the method **once or multiple times** produces the **same result**.
- `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` are **idempotent**
- `POST` is **NOT idempotent** (each call creates a new resource)
- `PATCH` depends on implementation

```
Example of idempotency:

PUT /users/42  {"name": "Naman"}   → User 42 is now "Naman"
PUT /users/42  {"name": "Naman"}   → User 42 is still "Naman" (same result!)

POST /users    {"name": "Naman"}   → Creates user 43
POST /users    {"name": "Naman"}   → Creates user 44 (different result!)
```

## 🆚 PUT vs PATCH — The Key Difference

```
Current user:
{"id": 42, "name": "Naman", "email": "n@x.com", "role": "user"}

PUT /users/42 with {"name": "Naman G"}
Result: {"id": 42, "name": "Naman G"}  ← email and role are GONE!

PATCH /users/42 with {"name": "Naman G"}
Result: {"id": 42, "name": "Naman G", "email": "n@x.com", "role": "user"}  ← only name changed!
```

- **PUT** = Full replacement (send ALL fields)
- **PATCH** = Partial update (send only changed fields)

## 📊 Quick Reference Table

| Method  | Purpose         | Body? | Safe? | Idempotent? |
|---------|-----------------|-------|-------|-------------|
| GET     | Read            | ❌    | ✅    | ✅           |
| POST    | Create          | ✅    | ❌    | ❌           |
| PUT     | Full Update     | ✅    | ❌    | ✅           |
| PATCH   | Partial Update  | ✅    | ❌    | ⚠️           |
| DELETE  | Delete          | ❌    | ❌    | ✅           |
| HEAD    | Headers Only    | ❌    | ✅    | ✅           |
| OPTIONS | Check Allowed   | ❌    | ✅    | ✅           |

---

## 📝 Key Takeaways

- HTTP methods tell the server what action you want to perform
- **GET** reads, **POST** creates, **PUT** replaces, **PATCH** updates, **DELETE** removes
- Safe methods don't change server state
- Idempotent methods give the same result no matter how many times you call them
- PUT replaces the whole resource; PATCH updates only specific fields

---

**← Previous:** [02 — URLs & URIs](../02_urls_and_uris/lesson.md)
**Next →** [04 — Status Codes](../04_status_codes/lesson.md)
