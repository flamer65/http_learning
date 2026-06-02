# Exercises — URLs & URIs

## Exercise 1: Break Down These URLs

For each URL, identify the **scheme, host, port, path, query params, and fragment**.

### URL 1:
```
https://www.amazon.in:443/s?k=laptop&ref=nb_sb_noss#results
```

```
Scheme: https:// 
Host: www.amazon.in
Port: 443
Path: /s
Query Parameters: ?
  - k=laptop
  - ref=nb_sb_noss
Fragment: #results
```

### URL 2:
```
http://localhost:3000/api/v2/users?page=1&limit=25&sort=name
```

```
Scheme: http://
Host: localhost
Port: 3000
Path: /api/v2/users
Query Parameters: ?
  - page=1
  - limit=25
  - sort=name
Fragment: no fragment
```

### URL 3:
```
ftp://files.example.com/documents/report%202026.pdf
```

```
Scheme: ftp://
Host: files.example.com
Port: no port
Path: /documents/report%202026.pdf
What does %20 decode to? space " "
```

---

## Exercise 2: Build URLs

Construct proper URLs for these scenarios:

**Scenario 1:** Search for "wireless mouse" on an API at `api.shop.com`, using HTTPS, sorted by price ascending, page 2, limit 10.

```
Your URL: https://api.shop.com/search?query=wireless%20mouse&sort=price:asc&page=2&limit=10

```

**Scenario 2:** Get user with ID 42's profile picture from `cdn.myapp.com` using HTTPS on port 8443.

```
Your URL: https://cdn.myapp.com:8443/users/42/profile-picture

```

**Scenario 3:** Search for "C++ programming & algorithms" on `search.example.com`. Remember to encode special characters!

```
Your URL: https://search.example.com/search?query=C%2B%2B%20programming%20%26%20algorithms

```

---

## Exercise 3: URL Encoding

Encode these strings for use in a URL query parameter:

1. `hello world` →    hello%20world
2. `price=100&currency=INR` →  price=100 currency=INR
3. `user@example.com` → user%40example.com
4. `path/to/file` → path%2Fto%2Ffile
5. `100% done!` → 100%25

---

## Exercise 4: Path Params vs Query Params

For each scenario, design the URL using the right approach (path params vs query params):

1. Get a specific book with ID 789
```
Your URL:  https://example.com/books/789
```

2. Search for books by author "tolkien" in the "fantasy" genre
```
Your URL: https://example.com/books?author=tolkien&genre=fantasy
```

3. Get the 3rd comment on post 42 by user 7
```
Your URL: https://example.com/users/7/posts/42/comments/3
```

4. List all products, filtered by category "electronics", priced under 1000, sorted by rating
```
Your URL: https://example.com/products?category=electronics&price=1000&sort=rating
```

---

## Exercise 5: curl with Query Params

Run these commands and observe what the server receives:

```bash
# 1. Simple query params
curl "https://httpbin.org/get?name=naman&city=delhi"

# 2. URL encoded values
curl "https://httpbin.org/get?query=hello%20world"

# 3. Path params
curl https://httpbin.org/anything/api/v1/users/42/posts
```

**Tasks:**
- [ ] Look at the `args` field in the JSON response — these are your query params
- [ ] Look at the `url` field — this is the full URL the server received
- [ ] For the path params example, look at the `url` field

Write what you learned:
the difference between the path params and query params is that the path params are used to identify the resource and the query params are used to filter the resource
```
Observations:
where ever the query is used with ? the server recives arguments 
when the path is used for filtering the server recives the url as is without any modification
and different encoding how to encode the different symbols

```

---

✅ **Done with exercises?** Mark `02 — URLs & URIs` as complete in the main [README.md](../README.md)!
