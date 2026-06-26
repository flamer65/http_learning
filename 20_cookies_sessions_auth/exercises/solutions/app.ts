import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cookieRoutes from "./routes/cookies";
import sessionAuthRoutes from "./routes/sessionAuth";
import jwtAuthRoutes from "./routes/jwtAuth";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "session-secret",
  resave: false,
  saveUninitialized: false
}));

app.use("/cookies", cookieRoutes);
app.use("/auth", sessionAuthRoutes);
app.use("/jwt", jwtAuthRoutes);
