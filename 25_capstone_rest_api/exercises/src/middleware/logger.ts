// 📝 Request Logger Middleware (Lesson 19)
//
// TODO: Implement request logging middleware.
//
// This middleware logs each incoming request with:
// - HTTP method
// - URL path
// - Response status code
// - Response time in ms

import { Request, Response, NextFunction } from "express";

// TODO: Implement logger middleware
// 1. Record the start time: const start = Date.now();
// 2. Listen for the "finish" event on res
// 3. On finish, log: "GET /api/books 200 12ms"
// 4. Call next()
//
// Hint:
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
//   });
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: Implement this middleware
  next();
};
