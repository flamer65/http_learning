import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { validateBody } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();
const repo = new AuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post("/register", validateBody(["username", "password"]), asyncHandler(controller.register));
router.post("/login", validateBody(["username", "password"]), asyncHandler(controller.login));

export default router;
