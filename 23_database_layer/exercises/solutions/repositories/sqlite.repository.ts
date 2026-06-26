import { Database } from "better-sqlite3";
import { Todo } from "../../src/models/todo.model";
import { ITodoRepository } from "../../src/repositories/todo.repository";

export class SqliteTodoRepository implements ITodoRepository {
  constructor(private db: Database) {}

  async create(data: Omit<Todo, "id">): Promise<Todo> {
    const id = Math.random().toString(36).substring(2, 9);
    const completedInt = data.completed ? 1 : 0;
    
    const stmt = this.db.prepare("INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)");
    stmt.run(id, data.title, completedInt);
    
    return { id, title: data.title, completed: !!data.completed };
  }

  async findAll(): Promise<Todo[]> {
    const stmt = this.db.prepare("SELECT * FROM todos");
    const rows = stmt.all() as { id: string, title: string, completed: number }[];
    
    return rows.map(row => ({
      ...row,
      completed: row.completed === 1
    }));
  }

  async findById(id: string): Promise<Todo | null> {
    const stmt = this.db.prepare("SELECT * FROM todos WHERE id = ?");
    const row = stmt.get(id) as { id: string, title: string, completed: number } | undefined;
    
    if (!row) return null;
    return { ...row, completed: row.completed === 1 };
  }

  async update(id: string, data: Partial<Omit<Todo, "id">>): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const newTitle = data.title !== undefined ? data.title : existing.title;
    const newCompleted = data.completed !== undefined ? data.completed : existing.completed;
    const completedInt = newCompleted ? 1 : 0;

    const stmt = this.db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?");
    stmt.run(newTitle, completedInt, id);

    return { id, title: newTitle, completed: newCompleted };
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare("DELETE FROM todos WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
