import { Request, Response, NextFunction } from "express";

export function validateInput(req: Request, res: Response, next: NextFunction) {
  const bodyString = JSON.stringify(req.body).toLowerCase();
  
  if (bodyString.includes("<script>") || bodyString.includes("drop table")) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  
  next();
}
