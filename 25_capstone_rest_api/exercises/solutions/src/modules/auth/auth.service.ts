import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { AppError } from "../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async register(username: string, passwordPlain: string) {
    const existingUser = this.repo.findByUsername(username);
    if (existingUser) {
      throw new AppError("Username already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    return this.repo.create({ username, passwordHash });
  }

  async login(username: string, passwordPlain: string) {
    const user = this.repo.findByUsername(username) as any;
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
    return { token, user: { id: user.id, username: user.username } };
  }
}
