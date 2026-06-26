/**
 * Sample article data for caching exercises.
 * Each article has an updatedAt date for Last-Modified header testing.
 */

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  updatedAt: Date;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "Understanding HTTP Caching",
    content:
      "HTTP caching is one of the most powerful performance optimizations available on the web. By properly configuring cache headers, you can dramatically reduce server load and improve page load times.",
    author: "Alice",
    updatedAt: new Date("2026-06-01T10:30:00Z"),
  },
  {
    id: 2,
    title: "ETags Explained",
    content:
      "An ETag (Entity Tag) is a fingerprint of a resource. When the content changes, the ETag changes. This allows browsers to make conditional requests and save bandwidth.",
    author: "Bob",
    updatedAt: new Date("2026-06-05T14:00:00Z"),
  },
  {
    id: 3,
    title: "Cache Invalidation Strategies",
    content:
      "Cache invalidation is famously one of the two hard problems in computer science. Content hashing, versioned URLs, and purge APIs are common strategies.",
    author: "Charlie",
    updatedAt: new Date("2026-06-10T09:15:00Z"),
  },
];
