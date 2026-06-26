# Lesson 19: Middleware Pipeline

🤔 **What is Middleware?**
Remember from Lesson 06 (Request/Response Cycle) that a server takes an HTTP Request and produces an HTTP Response. 
In Express, **Middleware** is any function that executes *during* this cycle. It sits in the "middle" between receiving the request and sending the response.

A middleware function has access to:
1. `req` (the Request object)
2. `res` (the Response object)
3. `next` (a function to pass control to the *next* middleware)

### 🧪 The Pipeline Concept
Express apps are essentially a series of middleware functions. When a request comes in, it passes through these functions in the exact order they were registered.

```text
Request → [Logger] → [Auth] → [JSON Parser] → [Route Handler] → Response
                                                     ↓ (if error occurs)
                                              [Error Handler]
```

### 🔑 Key Concepts

1. **`next()` flow**: If a middleware function doesn't end the request-response cycle (e.g., by calling `res.send()`), it **must** call `next()` to pass control to the next middleware. Otherwise, the request will hang forever!
2. **App-level vs Route-level**: 
   - App-level: Runs for *every* request (e.g., `app.use(logger)`)
   - Route-level: Runs only for specific routes (e.g., `app.use('/admin', authMiddleware)`)
3. **Built-in Middleware**: Express comes with some out-of-the-box middleware:
   - `express.json()`: Parses incoming requests with JSON payloads.
   - `express.urlencoded()`: Parses incoming requests with URL-encoded payloads.
   - `express.static()`: Serves static files.
4. **Error-handling Middleware**: Special middleware with exactly **4 parameters**: `(err, req, res, next)`. It catches errors thrown by previous middleware or route handlers.

### 📝 Execution Order Matters!
If you register `app.use(logger)` *after* `app.get('/', ...)`, the logger won't run for the `/` route because the route handler ends the cycle. Always register global middleware *before* your routes!
