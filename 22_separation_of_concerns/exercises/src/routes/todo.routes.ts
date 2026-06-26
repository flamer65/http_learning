import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { TodoService } from "../services/todo.service";
import { InMemoryTodoRepository } from "../repositories/todo.repository";

const router = Router();

// Wiring dependencies manually (Dependency Injection)
const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);
const controller = new TodoController(service);


// TODO: Wire up the routes to the controller methods
// GET / -> controller.getAll
router.get("/", controller.getAll);
// POST / -> controller.create
router.post("/", controller.create);
// GET /:id -> controller.getById
router.get("/:id", controller.getById);
// PATCH /:id/complete -> controller.complete
router.patch("/:id/complete", controller.complete);
// DELETE /:id -> controller.delete
router.delete("/:id", controller.delete);
export default router;
