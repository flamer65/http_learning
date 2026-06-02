# Exercises — Status Codes

## Exercise 1: Status Code Identification

What status code would be returned in each scenario?

| #   | Scenario                                                     | Code | Reason             |
| --- | ------------------------------------------------------------ | ---- | ------------------ |
| 1   | User successfully fetches their profile                      | 200  |                    |
| 2   | User creates a new post                                      | 201  | user created(Post) |
| 3   | User deletes their account                                   | 204  | No body to return  |
| 4   | User sends invalid JSON in request body                      | 400  | Malformed syntax   |
| 5   | User tries to access admin panel without being logged in     | 401  | Unautherized       |
| 6   | Logged-in user tries to delete another user (not allowed)    | 403  | Forbidden          |
| 7   | User requests /api/products/99999 (doesn't exist)            | 404  | Not found          |
| 8   | Server's database connection crashed                         | 500  | Server Crashed     |
| 9   | Old URL http://site.com/old redirects to http://site.com/new | 308  | Permant redirect   |
| 10  | User sends 100 requests in 1 second (rate limited)           | 429  | too many requests  |
| 11  | User tries POST on GET-only endpoint                         | 405  | method not allowed |
| 12  | User creates account with already-used email                 | 409  | Conflict           |

---

## Exercise 2: Explore with httpbin

Use httpbin to get different status codes and observe the responses:

```bash
# Task 1: Get each of these and note what you see
curl -v https://httpbin.org/status/200
curl -v https://httpbin.org/status/201
curl -v https://httpbin.org/status/204
curl -v https://httpbin.org/status/301
curl -v https://httpbin.org/status/400
curl -v https://httpbin.org/status/401
curl -v https://httpbin.org/status/403
curl -v https://httpbin.org/status/404
curl -v https://httpbin.org/status/500
```

**Questions:**

- Which status code returned an empty body? → 200, 201, 204 , 401, 403, 404,
- Which status code had a `Location` header? → 301,
- What was the `Location` header value for 301? → location: /redirect/1

---

## Exercise 3: Follow the Redirects

```bash
# This URL will redirect 3 times before giving a final response
curl -v -L https://httpbin.org/redirect/3
```

**Tasks:**

- [ ] Count how many redirects happened
- [ ] Note the status code at each hop
- [ ] What was the final status code?

```
Redirect 1: Status 302___ → Location: ___  /relative-redirect/2
Redirect 2: Status 302___ → Location: ___ /relative-redirect/1
Redirect 3: Status 302___ → Location: ___  /get
Final: Status ___  200
```

---

## Exercise 4: 401 vs 403

Explain the difference in your own words:

```
401 Unauthorized means: need to put the username or email with password and then what ever request you are making make it send with token jwt or anyhting


403 Forbidden means: you are have jwt or authenticated but not allwed for the specific method for the specific query for given path


Real world analogy:
you are registerd but not logged in with that not provided GET/user/1 need jwt or any authrization token. you are registed and have jwt or tokens but not allowed some data GET/users-list not allowed not have permissions

```

---

## Exercise 5: Error Handling Design

You're building an API. What status code and response body would you return for these errors?

### 5a. User submits signup form with empty name and invalid email

```
Status Code: 422
Response Body: {
  "error": "Validation failed",
  "details": {
    "name": "Name cannot be empty.",
    "email": "Please provide a valid email address."
  }
}


```

### 5b. User tries to edit a post that belongs to another user

```
Status Code: 403
Response Body:{
  "error": "don't have permission",
  "details": {
    "permisssion": "Not have permission for the user"
  }
}
```

### 5c. Server's payment service is temporarily down

```
Status Code: 503
Response Body:{
    "error": "Service down",
    details: {
        "maintaince": "Payment service is under maintaince will be available soon"
    }
}

```

### 5d. User requests GET /api/v2/products but your API only has v1

```
Status Code: 404
Response Body: {
    "error": "Not avaliable",
    "details": {
        "param": "v2 doesn't exist"
    }
}

```

---

## Exercise 6: Status Code Script

Write a simple bash script that tests multiple status codes:

```bash
# Create a file called test_status.sh and put this in it:
#!/bin/bash

endpoints=("200" "201" "204" "301" "400" "401" "403" "404" "500")

for code in "${endpoints[@]}"; do
    result=$(curl -s -o /dev/null -w "%{http_code}" "https://httpbin.org/status/$code")
    echo "Expected: $code | Got: $result"
done
```

Run it:

```bash
chmod +x test_status.sh
./test_status.sh
```

**Task:**

- [ ] Do all expected codes match the received codes? yes they do 
- [ ] Why or why not?

---

✅ **Done with exercises?** Mark `04 — Status Codes` as complete in the main [README.md](../README.md)!
