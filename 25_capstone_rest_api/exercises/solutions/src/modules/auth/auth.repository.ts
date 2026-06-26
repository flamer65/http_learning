import { db } from "../../config/database";

export class AuthRepository {
  findByUsername(username: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    return stmt.get(username);
  }

  create(user: { username: string; passwordHash: string }) {
    const stmt = db.prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?)");
    const info = stmt.run(user.username, user.passwordHash);
    return this.findById(info.lastInsertRowid as number);
  }

  findById(id: number) {
    const stmt = db.prepare("SELECT id, username, createdAt FROM users WHERE id = ?");
    return stmt.get(id);
  }
}
