import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../../src/app";
import { db } from "../../src/config/database";

describe("Books Integration", () => {
  let token: string;
  let authorId: number;

  beforeAll(async () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bio TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        authorId INTEGER NOT NULL,
        genre TEXT,
        isbn TEXT,
        publishedYear INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES authors (id)
      );
    `);
  });

  beforeEach(async () => {
    db.exec("DELETE FROM books");
    db.exec("DELETE FROM authors");
    db.exec("DELETE FROM users");

    // create user
    await request(app).post("/api/auth/register").send({
      username: "bookuser",
      password: "password",
    });
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "bookuser",
      password: "password",
    });
    token = loginRes.body.token;

    // create author
    const authorRes = await request(app)
      .post("/api/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Author Test" });
    authorId = authorRes.body.id;
  });

  afterAll(() => {
    db.exec("DROP TABLE IF EXISTS books");
    db.exec("DROP TABLE IF EXISTS authors");
    db.exec("DROP TABLE IF EXISTS users");
  });

  it("POST /api/books without auth -> 401", async () => {
    const res = await request(app).post("/api/books").send({
      title: "Test",
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/books with auth + invalid body -> 400", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "", // invalid
      });
    expect(res.status).toBe(400);
  });

  it("POST /api/books with auth + valid body -> 201", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Book",
        authorId: authorId,
        genre: "fiction",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Valid Book");
  });

  it("GET /api/books -> 200 + array + Cache-Control", async () => {
    await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "B1", authorId, genre: "fiction" });

    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.headers["cache-control"]).toContain("public, max-age=300");
  });

  it("GET /api/books?genre=fiction -> filtered results", async () => {
    await request(app).post("/api/books").set("Authorization", `Bearer ${token}`).send({ title: "B1", authorId, genre: "fiction" });
    await request(app).post("/api/books").set("Authorization", `Bearer ${token}`).send({ title: "B2", authorId, genre: "non-fiction" });

    const res = await request(app).get("/api/books?genre=fiction");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("B1");
  });

  it("GET /api/books?sort=title -> sorted results", async () => {
    await request(app).post("/api/books").set("Authorization", `Bearer ${token}`).send({ title: "Z Book", authorId, genre: "fiction" });
    await request(app).post("/api/books").set("Authorization", `Bearer ${token}`).send({ title: "A Book", authorId, genre: "non-fiction" });

    const res = await request(app).get("/api/books?sort=title");
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("A Book");
    expect(res.body[1].title).toBe("Z Book");
  });

  it("GET /api/books/:id -> 200 + book (includes ETag) and 304 on If-None-Match", async () => {
    const postRes = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "ETag Book", authorId, genre: "fiction" });
    
    const bookId = postRes.body.id;

    const res1 = await request(app).get(`/api/books/${bookId}`);
    expect(res1.status).toBe(200);
    const etag = res1.headers["etag"];
    expect(etag).toBeDefined();

    const res2 = await request(app).get(`/api/books/${bookId}`).set("If-None-Match", etag);
    expect(res2.status).toBe(304);
  });

  it("PUT /api/books/:id -> 200", async () => {
    const postRes = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Old Title", authorId, genre: "fiction" });
    
    const bookId = postRes.body.id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Title", authorId, genre: "fiction" });
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New Title");
  });

  it("DELETE /api/books/:id -> 204", async () => {
    const postRes = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete Me", authorId, genre: "fiction" });
    
    const bookId = postRes.body.id;

    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/api/books/${bookId}`);
    expect(getRes.status).toBe(404);
  });
});
