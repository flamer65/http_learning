import express from "express";
import { demoRouter } from "./routes/demo";

export const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api", demoRouter);

// TODO: Redirect /old-page to /new-page with a 301 status
app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page");
});
