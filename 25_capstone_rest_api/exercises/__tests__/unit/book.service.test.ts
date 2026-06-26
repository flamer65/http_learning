import { describe, it, expect, mock, beforeEach } from "bun:test";
import { BookService } from "../../src/modules/books/book.service";
import { AppError } from "../../src/utils/AppError";

describe("BookService Unit", () => {
  let mockRepo: any;
  let service: BookService;

  beforeEach(() => {
    mockRepo = {
      findAll: mock(),
      findById: mock(),
      create: mock(),
      update: mock(),
      delete: mock(),
      findByAuthorId: mock(),
    };
    service = new BookService(mockRepo);
  });

  it("Create book with valid data -> returns book", () => {
    const validBook = { title: "Test", authorId: 1 };
    mockRepo.create.mockReturnValue({ id: 1, ...validBook });

    const result = service.createBook(validBook);
    expect(result.id).toBe(1);
    expect(result.title).toBe("Test");
  });

  it("Create book without title -> ValidationError (AppError)", () => {
    const invalidBook = { authorId: 1 } as any;

    expect(() => {
      service.createBook(invalidBook);
    }).toThrow(AppError);
    
    try {
      service.createBook(invalidBook);
    } catch (e: any) {
      expect(e.statusCode).toBe(400);
    }
  });

  it("Get book by ID -> returns book or NotFoundError", () => {
    mockRepo.findById.mockReturnValue({ id: 1, title: "Test" });

    const result = service.getBookById(1);
    expect(result.id).toBe(1);

    mockRepo.findById.mockReturnValue(undefined);

    expect(() => {
      service.getBookById(999);
    }).toThrow(AppError);
  });
});
