import { Router } from "express";
import { users } from "../data/users";

export const userRouter = Router();

// TODO 1: GET / - Return array of users.
// If req.query.role is present, filter by role.
// If req.query.sort === 'name', sort by name alphabetically.
userRouter.get("/", (req, res) => {
  // your code here
  let result = [...users];

  if (req.query.role) {
    result = result.filter((u) => u.role === req.query.role);
  }
  if (req.query.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }
  res.status(200).json(result);
});

// TODO 2: GET /:id - Return user with given id.
// If not found, return 404 with { error: "User not found" }
userRouter.get("/:id", (req, res) => {
  // your code here
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

// TODO 3: POST / - Create a new user. Assign a new ID. Return 201 + created user.
userRouter.post("/", (req, res) => {
  // your code here
  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// TODO 4: PUT /:id - Replace user completely (except id). Return 200 + user.
// If not found, return 404.
userRouter.put("/:id", (req, res) => {
  // your code here
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ message: "User not found" });
  }
  users[index] = { id: users[index].id, ...req.body };
  res.status(200).json(users[index]);
});

// TODO 5: PATCH /:id - Update only provided fields. Return 200 + user.
// If not found, return 404.
userRouter.patch("/:id", (req, res) => {
  // your code here
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ message: "User not found" });
  }
  users[index] = { ...users[index], ...req.body };
   res.status(200).json(users[index]);
});

// TODO 6: DELETE /:id - Delete user. Return 204.
// If not found, return 404.
userRouter.delete("/:id", (req, res) => {
  // your code here
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
      res.status(404).json({ message: "User not found" });
  }
  users.splice(index, 1)
  res.status(204).send()

});
