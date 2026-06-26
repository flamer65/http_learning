import { Request, Response, NextFunction } from "express";

/**
 * ⏱️ Rate Limiter Middleware — SOLUTION
 *
 * Simple in-memory rate limiter using a Map to track requests per IP.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  // Each call to createRateLimiter creates a fresh Map — this is why
  // we use a factory function. In tests, each test gets a new app
  // with a new rate limiter and a clean Map.
  const store = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction): void => {
    // Get the client's IP address
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    // Look up existing entry for this IP
    const entry = store.get(ip);

    // If no entry, or the window has expired, start a new window
    if (!entry || now > entry.resetAt) {
      store.set(ip, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      next();
      return;
    }

    // If we've hit the max, reject with 429
    if (entry.count >= config.maxRequests) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    // Otherwise, increment and allow
    entry.count++;
    next();
  };
}
