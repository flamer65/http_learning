import { Database } from "better-sqlite3";
import { Todo } from "../models/todo.model";
import { ITodoRepository } from "./todo.repository";

export class SqliteTodoRepository implements ITodoRepository {
  constructor(private db: Database) {}

  async create(data: Omit<Todo, "id">): Promise<Todo> {
    const id = Math.random().toString(36).substring(2, 9);
    const completedInt = data.completed ? 1 : 0;
    this.db.prepare(`INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)`).run(id, data.title, completedInt);
    return { id, title: data.title, completed: data.completed ?? false };
  }

  async findAll(): Promise<Todo[]> {
    // TODO: Prepare a SELECT * statement from `todos`.
    // Remember to map the completed integer back to boolean.
    const rows = this.db.prepare(`SELECT * FROM todos`).all();
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
    }));
  }

  async findById(id: string): Promise<Todo | null> {
    // TODO: Prepare a SELECT * statement by id.
    const row = this.db.prepare(`SELECT * FROM todos WHERE id = ?`).get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
    };
  }

  async update(id: string, data: Partial<Omit<Todo, "id">>): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
     const newTitle = data.title !== undefined ? data.title : existing.title;
    const newCompleted = data.completed !== undefined ? data.completed : existing.completed;
    const completedInt = newCompleted ? 1 : 0;
    this.db.prepare(`UPDATE todos SET title = ?, completed = ? WHERE id = ?`).run(newTitle, completedInt, id);
    return {
      id, 
      title: newTitle,
      completed: newCompleted,
    };
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Prepare a DELETE statement by id.
    // Return true if rows were affected, false otherwise.
    const result = this.db.prepare(`DELETE FROM todos WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}
