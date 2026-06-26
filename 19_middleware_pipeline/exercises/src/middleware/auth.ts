import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Check if Authorization header exists. If not, respond with 401 { error: "No authorization header" }
  // TODO: Check if token is "Bearer valid-token". If not, respond with 401 { error: "Invalid token" }
  // TODO: If valid, call next()
  const authHeader = req.headers.authorization;
  if(!authHeader){
    res.status(401).json({error: "No authorization header"});
    return;
  }
  if(authHeader !== "Bearer valid-token"){
    res.status(401).json({error: "Invalid token"});
    return;
  }
  next();
};
