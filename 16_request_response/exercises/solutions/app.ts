import express from "express";
import { demoRouter } from "./routes/demo";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", demoRouter);

app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page");
});
