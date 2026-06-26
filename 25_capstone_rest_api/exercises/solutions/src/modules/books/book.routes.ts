import { Router } from "express";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { BookRepository } from "./book.repository";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { cacheControl, etagMiddleware } from "../../middleware/cache";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();
const repo = new BookRepository();
const service = new BookService(repo);
const controller = new BookController(service);

router.get("/", cacheControl(300), asyncHandler(controller.getAll));
router.get("/:id", etagMiddleware, asyncHandler(controller.getById));
router.post("/", requireAuth, validateBody(["title", "authorId"]), asyncHandler(controller.create));
router.put("/:id", requireAuth, validateBody(["title", "authorId"]), asyncHandler(controller.update));
router.delete("/:id", requireAuth, asyncHandler(controller.delete));

export default router;
