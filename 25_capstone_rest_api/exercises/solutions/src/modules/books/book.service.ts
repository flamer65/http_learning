import { BookRepository } from "./book.repository";
import { AppError } from "../../utils/AppError";

export class BookService {
  constructor(private repo: BookRepository) {}

  getAllBooks(filters: { genre?: string; sort?: string }) {
    return this.repo.findAll(filters);
  }

  getBookById(id: number) {
    const book = this.repo.findById(id);
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    return book;
  }

  createBook(data: any) {
    if (!data.title) {
      throw new AppError("Title is required", 400);
    }
    if (!data.authorId) {
      throw new AppError("Author ID is required", 400);
    }
    return this.repo.create(data);
  }

  updateBook(id: number, data: any) {
    const existing = this.getBookById(id); // Throws 404 if not found
    if (!data.title || !data.authorId) {
      throw new AppError("Title and Author ID are required", 400);
    }
    return this.repo.update(id, data);
  }

  deleteBook(id: number) {
    this.getBookById(id); // Throws 404 if not found
    this.repo.delete(id);
  }
}
