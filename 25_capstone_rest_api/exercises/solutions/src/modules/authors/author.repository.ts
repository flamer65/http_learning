import { db } from "../../config/database";

export class AuthorRepository {
  findAll() {
    const stmt = db.prepare("SELECT * FROM authors");
    return stmt.all();
  }

  findById(id: number) {
    const stmt = db.prepare("SELECT * FROM authors WHERE id = ?");
    return stmt.get(id);
  }

  create(author: { name: string; bio?: string }) {
    const stmt = db.prepare("INSERT INTO authors (name, bio) VALUES (?, ?)");
    const info = stmt.run(author.name, author.bio || null);
    return this.findById(info.lastInsertRowid as number);
  }
}
