import { Todo } from "../models/todo.model";

export class  InMemoryTodoRepository {
  private todos: Todo[] = [];
  private currentId = 1;

  create(data: Omit<Todo, "id" | "createdAt">): Todo {
    // TODO: Implement create
    // Create new todo object with id and createdAt, push to array, return it
    const newTodo = {
      ...data,
      id: this.currentId++,
      createdAt: new Date()
    }
    this.todos.push(newTodo)
    return newTodo;
  }

  findAll(): Todo[] {
    // TODO: Return all todos
    return this.todos;
  }

  findById(id: number): Todo | null {
    // TODO: Find and return todo by id, or null if not found

    return this.todos.find(todo => todo.id === id) || null;
  }

  update(id: number, data: Partial<Todo>): Todo | null {
    // TODO: Update todo properties if found, return updated todo or null
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    
    this.todos[index] = { ...this.todos[index], ...data };
    return this.todos[index];
  }

  delete(id: number): boolean {
    // TODO: Remove todo by id. Return true if deleted, false if not found
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;

  }
}
