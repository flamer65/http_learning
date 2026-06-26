import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // TODO: Log the error
  // TODO: Respond with 500 status and JSON { error: "Something went wrong" }
  console.error("Error caught in middleware:", err.message);
  res.status(500).json({ error: "Something went wrong" });
};
