import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await this.service.register(username, password);
    res.status(201).json({ message: "Registered successfully", user });
  };

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const data = await this.service.login(username, password);
    res.status(200).json(data);
  };
}
