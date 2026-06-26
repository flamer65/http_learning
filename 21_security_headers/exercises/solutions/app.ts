import express from "express";
import { securityHeaders } from "./middleware/security";
import { createRateLimiter } from "./middleware/rateLimit";
import { validateInput } from "./middleware/validate";
import { apiRouter } from "./routes/api";

/**
 * 🛡️ Security Headers App — SOLUTION
 *
 * This is the complete solution using manual security middleware.
 */

export function createApp() {
  const app = express();

  // Step 1: Remove X-Powered-By — don't leak your tech stack!
  app.disable("x-powered-by");

  // Step 2: Parse JSON bodies
  app.use(express.json());

  // Step 3: Apply security headers to every response
  app.use(securityHeaders);

  // Step 4: Apply rate limiting (max 3 requests per 60-second window)
  app.use(createRateLimiter({ maxRequests: 3, windowMs: 60000 }));

  // Step 5: Validate input on requests with bodies
  app.use(validateInput);

  // Step 6: Mount API routes
  app.use("/api", apiRouter);

  return app;
}

export const app = createApp();
