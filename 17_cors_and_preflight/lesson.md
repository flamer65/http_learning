# 🛡️ Lesson 17: CORS & Preflight Implementation

Remember Lesson 11 where we talked about CORS? Now we're going to build it!

## 🤔 Why is CORS a Server Problem?

CORS (Cross-Origin Resource Sharing) is fundamentally a security feature enforced by the **browser**, but it is completely controlled by the **server**.

If your frontend is on `http://localhost:3000` and it calls an API on `http://localhost:8000`, the browser asks the server: *"Hey, is it okay if this frontend accesses your data?"*

The server answers using HTTP headers. If the server doesn't respond with the right headers, the browser blocks the frontend from reading the response.

## 🔑 Simple Requests vs Preflight Requests

### Simple Requests
For basic requests (`GET`, `POST` with standard headers), the browser sends the request immediately and checks the response headers:
- `Access-Control-Allow-Origin`: Who is allowed?
- `Access-Control-Expose-Headers`: What custom headers can the frontend read?
- `Access-Control-Allow-Credentials`: Can the frontend send cookies?

### 🛫 Preflight Requests (OPTIONS)
For complex requests (like `PUT`, `DELETE`, or custom headers like `Authorization`), the browser sends a "preflight" check first using the `OPTIONS` method.
The server must respond to this `OPTIONS` request with:
- `Access-Control-Allow-Methods`: What methods are allowed?
- `Access-Control-Allow-Headers`: What headers are allowed?
- `Access-Control-Max-Age`: How long can the browser cache this preflight check?

## 📝 The `cors` NPM Package

While we are building it from scratch to understand the headers, in the real world, you'll use the `cors` package:

```typescript
import cors from 'cors';

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
```

## 🧪 Your Task
Go to `exercises/src/middleware/cors.ts` and implement the manual CORS headers so all the tests in `cors.test.ts` pass!
