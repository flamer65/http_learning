import { Request, Response, NextFunction } from "express";

export function validateInput(req: Request, res: Response, next: NextFunction) {
  // TODO: Implement simple input validation/sanitization
  // Check req.body for any string fields containing:
  // - "<script>" (XSS)
  // - "DROP TABLE" (SQLi)
  // If found, return 400 { error: "Invalid input" }
  // Otherwise, next()
  const body = req.body;
  for (const key in body) {
    const value = body[key];
    if (typeof value === "string") {
      if (value.includes("<script>") || value.toUpperCase().includes("DROP TABLE")) {
        return res.status(400).json({ error: "Invalid input" });
      }
    }
  }
  
  next();
}
