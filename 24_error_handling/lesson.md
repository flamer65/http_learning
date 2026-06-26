# Lesson 24: Error Handling 💥

Handling errors effectively is crucial for a robust API. Without proper error handling, a crash in one route might bring down your entire server or leave clients hanging without a response!

🤔 **Why do we need centralized error handling?**
If you handle errors individually in every single controller method with `try-catch` blocks, your code will quickly become messy and inconsistent. Different developers might return different error formats (e.g., `{ message: "Error" }` vs `{ error: "Error" }`). Centralized error handling solves this by processing all errors in one place.

## Express Error Middleware

Express has a special type of middleware for handling errors. It takes **four** arguments instead of three: `(err, req, res, next)`. When you call `next(error)` in a route or when an synchronous error is thrown, Express skips all regular routes and goes straight to the error middleware.

## The Async/Await Problem ⚠️

Express 4 does *not* automatically catch errors thrown inside `async` route handlers. If a promise rejects and you don't catch it, your app could crash with an `UnhandledPromiseRejection`, or the request will hang forever!

To fix this, we use a wrapper function called `asyncHandler` that wraps our async routes, catches any errors, and passes them to `next()`:

```typescript
const asyncHandler = (fn: RequestHandler) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

*(Note: Express 5 handles async errors natively, but Express 4 is still the industry standard).*

## Structured Errors & Custom Error Classes 🏗️

A good API responds with a consistent error structure. We'll use this format:
```json
{
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

To achieve this, we can create a base `AppError` class that extends the built-in `Error` class, adding a `statusCode` and `code`. We then create specific subclasses like `ValidationError`, `NotFoundError`, and `AuthenticationError`.

## The Exercises 🧪

In this lesson, you'll implement the `asyncHandler` and centralized `errorHandler` middleware. We've set up a few routes that deliberately throw different types of errors. Make the tests pass by catching them gracefully!
