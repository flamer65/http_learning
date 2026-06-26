# Lesson 22: Separation of Concerns & Architecture 🏗️

As your Express applications grow, putting all your code inside the route handlers (`app.get('/...', (req, res) => {...})`) becomes a nightmare. It makes the code hard to read, hard to reuse, and incredibly difficult to test.

## 📝 The "Why": Layered Architecture

To solve this, we separate our application into distinct **layers**, where each layer has a single responsibility. This is called **Separation of Concerns**.

Here is the standard 3-tier architecture for web APIs:

```text
HTTP Request
    ↓
[Routes]        ← URL → handler mapping only
    ↓
[Controllers]   ← Parse HTTP input, call service, format HTTP output
    ↓
[Services]      ← Business logic, validation rules
    ↓
[Repositories]  ← Data access (CRUD operations)
    ↓
Data Store
```

### The Rules of the Layers:
1. **Routes**: Only care about *what* URL is being called and *which* controller method should handle it.
2. **Controllers**: Understand HTTP (req, res, status codes). They extract data from `req.body` or `req.params`, pass it to the service, and send the response. **No business logic or database queries here!**
3. **Services**: Contain the core business rules. They don't know anything about HTTP (no `req` or `res`) or the underlying database implementation. They just take plain JavaScript objects, enforce rules, and call the repository.
4. **Repositories**: Handle data persistence. They don't know about business rules or HTTP. They just do CRUD (Create, Read, Update, Delete) on the database.

## 🤔 Dependency Injection (Simple Version)

How do these layers talk to each other? We pass the dependencies via constructors!

```typescript
// Good: Pass dependency (Repository) to the Service
const myRepo = new TodoRepository();
const myService = new TodoService(myRepo);
const myController = new TodoController(myService);
```

This allows us to easily **mock** the database when testing the service!

## 🧪 The "How": Testing at Every Level

Because our layers are isolated, we can write different types of tests:
- **Unit tests for Repositories**: Verify database operations.
- **Unit tests for Services**: Verify business logic without touching HTTP or real databases.
- **Integration tests for Routes**: Verify the whole HTTP flow end-to-end.

Let's build a clean, layered Todo API! 🚀
