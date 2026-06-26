import { Todo } from "../models/todo.model";

export interface ITodoRepository {
  create(data: Omit<Todo, "id">): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  update(id: string, data: Partial<Omit<Todo, "id">>): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async create(data: Omit<Todo, "id">): Promise<Todo> {
    const id = Math.random().toString(36).substring(2, 9);
    const todo: Todo = { id, ...data, completed: data.completed ?? false };
    this.todos.set(id, todo);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async update(id: string, data: Partial<Omit<Todo, "id">>): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    this.todos.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
}
