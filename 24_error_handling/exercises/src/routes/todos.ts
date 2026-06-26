import { Router } from "express";
import { TodoService } from "../services/todo.service";
import { TodoRepository } from "../repositories/todo.repository";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const service = new TodoService(new TodoRepository());

router.get("/:id", asyncHandler(async (req, res) => {
  const todo = await service.getTodo(req.params.id);
  res.json(todo);
}));

router.post("/", asyncHandler(async (req, res) => {
  const todo = await service.createTodo(req.body);
  res.status(201).json(todo);
}));

export { router as todoRoutes };
