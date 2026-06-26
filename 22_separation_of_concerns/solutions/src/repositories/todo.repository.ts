import { Todo } from "../models/todo.model";

export class InMemoryTodoRepository {
  private todos: Todo[] = [];
  private currentId = 1;

  create(data: Omit<Todo, "id" | "createdAt">): Todo {
    const newTodo: Todo = {
      ...data,
      id: this.currentId++,
      createdAt: new Date()
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findById(id: number): Todo | null {
    return this.todos.find(todo => todo.id === id) || null;
  }

  update(id: number, data: Partial<Todo>): Todo | null {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    
    this.todos[index] = { ...this.todos[index], ...data };
    return this.todos[index];
  }

  delete(id: number): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    
    this.todos.splice(index, 1);
    return true;
  }
}
