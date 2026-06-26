import { Todo } from "../models/todo.model";
import { ITodoRepository } from "../repositories/todo.repository";

export class TodoService {
  constructor(private repository: ITodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    return this.repository.findById(id);
  }

  async createTodo(data: { title: string; completed?: boolean }): Promise<Todo> {
    if (!data.title) {
      throw new Error("Title is required");
    }
    return this.repository.create({ title: data.title, completed: data.completed || false });
  }

  async updateTodo(id: string, data: { title?: string; completed?: boolean }): Promise<Todo | null> {
    return this.repository.update(id, data);
  }

  async deleteTodo(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
