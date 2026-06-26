import { AuthorRepository } from "./author.repository";
import { AppError } from "../../utils/AppError";

export class AuthorService {
  constructor(private repo: AuthorRepository) {}

  getAllAuthors() {
    return this.repo.findAll();
  }

  getAuthorById(id: number) {
    const author = this.repo.findById(id);
    if (!author) {
      throw new AppError("Author not found", 404);
    }
    return author;
  }

  createAuthor(data: { name: string; bio?: string }) {
    if (!data.name) {
      throw new AppError("Author name is required", 400);
    }
    return this.repo.create(data);
  }
}
