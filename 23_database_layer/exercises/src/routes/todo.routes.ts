import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { ITodoRepository } from "../repositories/todo.repository";
import { TodoService } from "../services/todo.service";

export function createTodoRouter(repository: ITodoRepository) {
  const router = Router();
  const service = new TodoService(repository);
  const controller = new TodoController(service);

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
