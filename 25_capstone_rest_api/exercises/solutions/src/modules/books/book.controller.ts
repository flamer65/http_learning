import { Request, Response } from "express";
import { BookService } from "./book.service";

export class BookController {
  constructor(private service: BookService) {}

  getAll = (req: Request, res: Response) => {
    const { genre, sort } = req.query;
    const books = this.service.getAllBooks({
      genre: genre as string,
      sort: sort as string,
    });
    res.json(books);
  };

  getById = (req: Request, res: Response) => {
    const book = this.service.getBookById(Number(req.params.id));
    res.json(book);
  };

  create = (req: Request, res: Response) => {
    const book = this.service.createBook(req.body);
    res.status(201).json(book);
  };

  update = (req: Request, res: Response) => {
    const book = this.service.updateBook(Number(req.params.id), req.body);
    res.json(book);
  };

  delete = (req: Request, res: Response) => {
    this.service.deleteBook(Number(req.params.id));
    res.status(204).send();
  };
}
