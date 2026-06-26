import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";

export class TodoController {
  constructor(private todoService: TodoService) {}

  getAll = (req: Request, res: Response) => {
    // Support filtering by completed status via query param ?completed=true|false
    const filters: { completed?: boolean } = {};
    if (req.query.completed !== undefined) {
      filters.completed = req.query.completed === "true";
    }
    
    const todos = this.todoService.getTodos(filters);
    res.json(todos);
  };

  create = (req: Request, res: Response) => {
    try {
      const todo = this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const todo = this.todoService.getTodoById(id);
    
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    
    res.json(todo);
  };

  complete = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
      const todo = this.todoService.completeTodo(id);
      res.json(todo);
    } catch (error: any) {
      if (error.message === "Todo not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  delete = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const success = this.todoService.deleteTodo(id);
    
    if (!success) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    
    res.status(204).send();
  };
}
