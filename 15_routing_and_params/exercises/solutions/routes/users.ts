import { Router } from "express";
import { users } from "../data/users";

export const userRouter = Router();

userRouter.get("/", (req, res) => {
  let result = [...users];

  if (req.query.role) {
    result = result.filter(u => u.role === req.query.role);
  }

  if (req.query.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.status(200).json(result);
});

userRouter.get("/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

userRouter.post("/", (req, res) => {
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

userRouter.put("/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[index] = { id: users[index].id, ...req.body };
  res.status(200).json(users[index]);
});

userRouter.patch("/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[index] = { ...users[index], ...req.body };
  res.status(200).json(users[index]);
});

userRouter.delete("/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users.splice(index, 1);
  res.status(204).send();
});
