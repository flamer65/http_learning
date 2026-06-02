# 02 — URLs & URIs

## 🤔 What's the Difference Between URL and URI?

- **URI** (Uniform Resource Identifier) — Identifies a resource (could be a name or location)
- **URL** (Uniform Resource Locator) — A specific type of URI that tells you **where** to find the resource

> In practice, people use URL and URI interchangeably. Don't stress about it.

## 🧬 Anatomy of a URL

```
https://www.example.com:443/api/users?name=naman&role=dev#section1
|____|  |_______________|___|________|___________________|________|
scheme       host        port  path     query string      fragment
```

Let's break it down:

| Part            | Example                | Purpose                                                                      |
|-----------------|------------------------|------------------------------------------------------------------------------|
| **Scheme**      | `https`                | Protocol to use (http, https, ftp)                                           |
| **Host**        | `www.example.com`      | Which server to connect to                                                   |
| **Port**        | `443`                  | Which port on the server (default: 80 for http, 443 for https)               |
| **Path**        | `/api/users`           | Which resource on the server                                                 |
| **Query String**| `?name=naman&role=dev` | Extra parameters (key=value pairs)                                           |
| **Fragment**    | `#section1`            | Points to a section in the page (client-side only, NOT sent to server)       |

## 🔗 Query Parameters (Query String)

Query parameters let you send data to the server via the URL.

```
https://api.github.com/search/repos?q=javascript&sort=stars&order=desc
```

Breaking down the query string:
- Starts with `?`
- Key-value pairs separated by `&`
- `q=javascript` → search query is "javascript"
- `sort=stars` → sort by stars
- `order=desc` → in descending order

### When to Use Query Parameters:
- Filtering data: `?category=books&price_max=500`
- Pagination: `?page=2&limit=20`
- Searching: `?q=search+term`
- Sorting: `?sort=date&order=asc`

## 🔤 URL Encoding (Percent Encoding)

URLs can only contain certain characters. Special characters must be **encoded**.

| Character       | Encoded            | Why?                                      |
|-----------------|--------------------|-------------------------------------------|
| Space           | `%20` or `+`       | Spaces aren't allowed in URLs             |
| `&`             | `%26`              | `&` separates query params                |
| `=`             | `%3D`              | `=` separates key from value              |
| `/`             | `%2F`              | `/` separates path segments               |
| `?`             | `%3F`              | `?` starts query string                   |
| `#`             | `%23`              | `#` starts fragment                       |
| `@`             | `%40`              | Used in email/auth                        |

Example:
```
Search: "hello world & more"
Encoded: ?q=hello%20world%20%26%20more
```

## 🛤 Path Parameters vs Query Parameters

Both can send data, but they're used differently:

### Path Parameters (part of the URL path)
```
GET /users/123          ← 123 is a path parameter (specific user)
GET /posts/456/comments ← 456 is a path parameter (comments for post 456)
```
**Used for:** Identifying a specific resource

### Query Parameters (after the `?`)
```
GET /users?role=admin&active=true  ← filtering users
GET /posts?page=2&limit=10        ← pagination
```
**Used for:** Filtering, sorting, searching, pagination

### Rule of Thumb:
> If you're identifying **WHICH** resource → **path parameter**
> If you're filtering/modifying **HOW** to get it → **query parameter**

## 🌍 Absolute vs Relative URLs

```
Absolute: https://example.com/api/users
Relative: /api/users  (uses same scheme + host as current page)
Relative: ../images/logo.png  (relative to current path)
```

## 🧪 Try It Yourself

```bash
# See how query parameters are received by the server
curl "https://httpbin.org/get?name=naman&skill=http&level=beginner"

# See URL encoding in action
curl "https://httpbin.org/get?message=hello%20world%20%26%20more"

# See how the server reflects your path
curl https://httpbin.org/anything/users/123/posts
```

---

## 📝 Key Takeaways

- A URL has: scheme, host, port, path, query string, and fragment
- Query parameters are key-value pairs after `?`, separated by `&`
- Special characters in URLs must be percent-encoded
- Path params identify resources; query params filter/sort them
- Fragments (`#`) are client-side only — never sent to the server

---

**← Previous:** [01 — What is HTTP?](../01_what_is_http/lesson.md)
**Next →** [03 — HTTP Methods](../03_http_methods/lesson.md)
