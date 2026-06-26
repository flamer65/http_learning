import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { TodoService } from "../services/todo.service";
import { InMemoryTodoRepository } from "../repositories/todo.repository";

const router = Router();

const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);
const controller = new TodoController(service);

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.patch("/:id/complete", controller.complete);
router.delete("/:id", controller.delete);

export default router;
