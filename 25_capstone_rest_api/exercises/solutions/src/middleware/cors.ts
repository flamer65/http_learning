import cors from "cors";

export const corsMiddleware = cors({
  origin: "*", // Or specific origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
