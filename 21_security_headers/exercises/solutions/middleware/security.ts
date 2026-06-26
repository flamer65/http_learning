import { Request, Response, NextFunction } from "express";

/**
 * 🛡️ Security Headers Middleware — SOLUTION
 *
 * Each header protects against a specific type of attack.
 */

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // HSTS: Force HTTPS for 1 year, including subdomains
  // Prevents SSL stripping attacks (MitM downgrades HTTPS → HTTP)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Prevent MIME sniffing — browser must trust our Content-Type
  // Without this, a .txt file could be interpreted as JavaScript
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking — our page cannot be displayed in an iframe
  res.setHeader("X-Frame-Options", "DENY");

  // Content Security Policy — only allow resources from our own origin
  // This is the most powerful defense against XSS
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  // Control how much URL info is sent in the Referer header
  // Same-origin gets full URL, cross-origin gets origin only
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Control which browser APIs can be used
  // Deny camera & microphone entirely, allow geolocation only for our origin
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  next();
}
