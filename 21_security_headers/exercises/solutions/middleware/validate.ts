import { Request, Response, NextFunction } from "express";

/**
 * 🧹 Input Validation Middleware — SOLUTION
 *
 * Checks request bodies for XSS and SQL injection patterns.
 */

// XSS patterns: detect script tags and HTML event handlers
const XSS_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /<\s*\/?\s*script\s*>/gi,
];

// SQL injection patterns: detect common SQL attack vectors
const SQL_PATTERNS: RegExp[] = [
  /('|"|;)\s*(DROP|DELETE|INSERT|UPDATE|SELECT|ALTER|CREATE|EXEC)/gi,
  /(--|\/\*|\*\/)/g,
  /\bUNION\s+SELECT\b/gi,
];

/**
 * Check if a string matches any dangerous pattern.
 */
function containsDangerousPattern(
  value: string,
  patterns: RegExp[]
): boolean {
  return patterns.some((pattern) => {
    // Reset lastIndex for global regexes (they're stateful!)
    pattern.lastIndex = 0;
    return pattern.test(value);
  });
}

/**
 * Recursively check all string values in an object for dangerous patterns.
 */
function hasDangerousContent(
  obj: unknown,
  patterns: RegExp[]
): boolean {
  if (typeof obj === "string") {
    return containsDangerousPattern(obj, patterns);
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => hasDangerousContent(item, patterns));
  }

  if (obj !== null && typeof obj === "object") {
    return Object.values(obj).some((value) =>
      hasDangerousContent(value, patterns)
    );
  }

  return false;
}

export function validateInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Only validate requests that have a body with content
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length > 0
  ) {
    // Check for XSS patterns
    if (hasDangerousContent(req.body, XSS_PATTERNS)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    // Check for SQL injection patterns
    if (hasDangerousContent(req.body, SQL_PATTERNS)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
  }

  next();
}
