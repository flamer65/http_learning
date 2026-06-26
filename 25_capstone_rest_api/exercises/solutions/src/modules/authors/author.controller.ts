import { Request, Response } from "express";
import { AuthorService } from "./author.service";

export class AuthorController {
  constructor(private service: AuthorService) {}

  getAll = (req: Request, res: Response) => {
    const authors = this.service.getAllAuthors();
    res.json(authors);
  };

  getById = (req: Request, res: Response) => {
    const author = this.service.getAuthorById(Number(req.params.id));
    res.json(author);
  };

  create = (req: Request, res: Response) => {
    const author = this.service.createAuthor(req.body);
    res.status(201).json(author);
  };
}
