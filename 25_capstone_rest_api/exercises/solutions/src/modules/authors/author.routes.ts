import { Router } from "express";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { AuthorRepository } from "./author.repository";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";

const router = Router();
const repo = new AuthorRepository();
const service = new AuthorService(repo);
const controller = new AuthorController(service);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", requireAuth, validateBody(["name"]), controller.create);

export default router;
