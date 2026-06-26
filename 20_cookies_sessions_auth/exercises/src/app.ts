import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cookieRoutes from "./routes/cookies";
import sessionAuthRoutes from "./routes/sessionAuth";
import jwtAuthRoutes from "./routes/jwtAuth";

export const app = express();

app.use(express.json());
// TODO: Use cookie-parser middleware
app.use(cookieParser());
// TODO: Use express-session middleware with a secret, resave: false, saveUninitialized: false

app.use(session({
    secret: "super-secret-session-key-for-learning",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}) as unknown as express.RequestHandler);
// TODO: Mount cookieRoutes at /cookies
app.use("/cookies", cookieRoutes);
// TODO: Mount sessionAuthRoutes at /auth
app.use("/auth", sessionAuthRoutes);
// TODO: Mount jwtAuthRoutes at /jwt
app.use("/jwt", jwtAuthRoutes);