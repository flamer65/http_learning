import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";

export class TodoController {
  constructor(private todoService: TodoService) {}

  getAll = async (req: Request, res: Response) => {
    const todos = await this.todoService.getAllTodos();
    res.json(todos);
  };

  getById = async (req: Request, res: Response) => {
    const todo = await this.todoService.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  };

  create = async (req: Request, res: Response) => {
    try {
      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    const updated = await this.todoService.updateTodo(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const success = await this.todoService.deleteTodo(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  };
}
