# 🎓 Lesson 25 — Capstone: Bookshelf API

You made it! 🎉 This is the final lesson in Part 2. In this lesson, you will build a complete, production-ready REST API from scratch using everything you've learned.

## 🎯 The Goal

We are building a "Bookshelf API" — a system to manage books, authors, users, and reviews. This capstone will force you to combine:

1. **Routing & Controllers** (Express basics, handling inputs/outputs)
2. **Layered Architecture** (Routes → Controllers → Services → Repositories)
3. **Database Integration** (SQLite)
4. **Authentication** (JWT, password hashing)
5. **Security** (Helmet, CORS, Validation)
6. **Performance** (Caching, ETags)
7. **Robustness** (Centralized error handling)
8. **Testing** (Unit & Integration tests)

## 🏗 Architecture Diagram

```text
       HTTP Request
           │
           ▼
┌───────────────────────┐
│     Middleware        │
│ (CORS, Security, etc.)│
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│       Routes          │  ← Maps URL + Method to Controller
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    Controllers        │  ← Extracts req data, calls Service, sends res
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Services         │  ← Business Logic, Validation, Rules
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│    Repositories       │  ← Database Operations (SQL)
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│      Database         │  ← SQLite
└───────────────────────┘
```

## 📖 API Documentation

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login (returns JWT)

### Books (Public read, Auth for write)
- `GET /api/books` — List all books (Supports `?genre=fiction` and `?sort=title`, Cache-Control: public, max-age=300)
- `GET /api/books/:id` — Get book by ID (Includes ETag for caching)
- `POST /api/books` — Create book (Auth required)
- `PUT /api/books/:id` — Update book (Auth required)
- `DELETE /api/books/:id` — Delete book (Auth required)

### Authors (Public read, Auth for write)
- `GET /api/authors` — List all authors
- `GET /api/authors/:id` — Get author with their books
- `POST /api/authors` — Create author (Auth required)

### Reviews (Auth required for write, public read)
- `POST /api/books/:id/reviews` — Add review to book
- `GET /api/books/:id/reviews` — Get reviews for book

## 🔑 Key Concepts to Remember

- **HTTP Status Codes:** Return `201 Created` for POSTs, `204 No Content` for DELETEs, `404 Not Found` for missing resources, `401 Unauthorized` for bad tokens, `409 Conflict` for duplicate usernames, and `400 Bad Request` for validation errors.
- **Caching:** Use `Cache-Control` for collection endpoints (`/api/books`). Use `ETag` for specific resource endpoints (`/api/books/:id`) and support `If-None-Match` to return `304 Not Modified`.
- **CORS:** Ensure your CORS middleware handles preflight (`OPTIONS`) requests properly.
- **Security:** Use Helmet for standard security headers, and always validate input before processing it.

## 📝 Your Task

The `exercises/__tests__` folder contains a comprehensive suite of tests. Your job is to implement the code in `exercises/src` to make all tests pass!

Start by setting up the database and models, then move on to the repositories, services, controllers, and routes for each module. Don't forget to wire everything together in `app.ts`.

Good luck! 🚀
