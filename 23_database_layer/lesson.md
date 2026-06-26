# Lesson 23: The Database Layer 🗄️

Welcome back! In the previous lesson, we learned about the 3-Tier Architecture. We separated our code into Routes, Controllers, Services, and Repositories. But we had one big problem: our data was stored in-memory.

🤔 **Why do we need a real database?**
Remember from our earlier HTTP lessons: HTTP is stateless. Our server needs to maintain state somewhere. In-memory data is fast, but it is lost every time the server restarts. To make our application useful, we need persistent storage.

## The Power of the Repository Pattern 🔑

The real magic of the Repository pattern is **abstraction**. Our Service layer doesn't care *how* data is stored; it only cares that it *can* be stored and retrieved using the methods defined in our `ITodoRepository` interface (`create`, `findAll`, `findById`, `update`, `delete`).

This means we can swap out our `InMemoryTodoRepository` for a `SqliteTodoRepository` without changing a single line of code in our Service or Controller layers! This makes testing incredibly easy and gives us the flexibility to change databases in the future.

## SQL Basics with better-sqlite3 🗃️

We'll use SQLite for this lesson. It's a fast, lightweight, file-based database that doesn't require a separate server process. The `better-sqlite3` library gives us a synchronous API that works perfectly with Bun.

### Migrations

Before we can query a database, we need tables. The process of setting up or modifying database schemas is called **migration**. We'll run a simple migration when our database connection is initialized:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0
);
```

*Note: SQLite doesn't have a native boolean type, so we use `INTEGER` (0 for false, 1 for true).*

## The Big Reveal 🪄

In this lesson's exercises, you'll implement the `SqliteTodoRepository`. Once you're done, we will run the **same tests** that passed with the `InMemoryTodoRepository`, but this time using your new SQLite repository. If the tests pass, you've successfully proven the power of the Repository pattern!

Let's get started! 🚀
