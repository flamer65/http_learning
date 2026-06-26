# Lesson 15: Express Routing & Parameters

Welcome to Lesson 15! In Lesson 02 we discussed URLs and URIs, and in Lesson 03 we explored HTTP Methods. Now we'll see how Express handles these concepts via its robust routing system.

## 📍 Routing Basics
Routing refers to how an application's endpoints (URIs) respond to client requests. In Express, you define a route using:
`app.METHOD(PATH, HANDLER)`
## 🧩 Express Routers
Instead of putting all routes in `app.ts`, Express provides `express.Router()`. It's like a mini-app that only handles routes, allowing you to group related endpoints (e.g., all `/api/users` routes).

## 🪪 Route Parameters (`req.params`)
When URLs contain dynamic segments, you capture them with route parameters. 
e.g., `/users/:id` -> `req.params.id`.
*Remember Lesson 02: Paths often identify specific resources.*

## 🔍 Query Strings (`req.query`)
Everything after the `?` in a URL is the query string.
e.g., `/users?role=admin` -> `req.query.role`.
Use this for sorting, filtering, or pagination.

## 🔁 Safe and Idempotent Methods (Lesson 03)
- **Safe methods** (GET, HEAD) don't modify resources.
- **Idempotent methods** (PUT, DELETE, GET, HEAD) produce the same result even if called multiple times.
- **POST** is neither safe nor idempotent. Making the same POST twice creates two resources!

## 🗣 HEAD Method
Express handles `HEAD` requests automatically if a `GET` route exists. A `HEAD` request returns the exact same headers as a `GET` request, but **without the response body**.
