export class TodoRepository {
  private todos: any[] = [];
  
  async getById(id: string) {
    return this.todos.find(t => t.id === id) || null;
  }
  
  async create(data: any) {
    const todo = { id: Math.random().toString(), ...data };
    this.todos.push(todo);
    return todo;
  }
}
