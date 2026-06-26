import { db } from "../../config/database";

export class BookRepository {
  findAll(filters: { genre?: string; sort?: string }) {
    let query = "SELECT * FROM books";
    const params: any[] = [];

    if (filters.genre) {
      query += " WHERE genre = ?";
      params.push(filters.genre);
    }

    if (filters.sort === "title") {
      query += " ORDER BY title ASC";
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  findById(id: number) {
    const stmt = db.prepare("SELECT * FROM books WHERE id = ?");
    return stmt.get(id);
  }

  create(book: { title: string; authorId: number; genre?: string; isbn?: string; publishedYear?: number }) {
    const stmt = db.prepare(
      "INSERT INTO books (title, authorId, genre, isbn, publishedYear) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(book.title, book.authorId, book.genre || null, book.isbn || null, book.publishedYear || null);
    return this.findById(info.lastInsertRowid as number);
  }

  update(id: number, book: { title: string; authorId: number; genre?: string; isbn?: string; publishedYear?: number }) {
    const stmt = db.prepare(
      "UPDATE books SET title = ?, authorId = ?, genre = ?, isbn = ?, publishedYear = ? WHERE id = ?"
    );
    stmt.run(book.title, book.authorId, book.genre || null, book.isbn || null, book.publishedYear || null, id);
    return this.findById(id);
  }

  delete(id: number) {
    const stmt = db.prepare("DELETE FROM books WHERE id = ?");
    stmt.run(id);
  }
}
