export interface Book {
  id: number;
  title: string;
  authorId: number;
  genre: string | null;
  isbn: string | null;
  publishedYear: number | null;
  createdAt: string;
}
