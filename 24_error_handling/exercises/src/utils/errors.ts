import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message: string) {
    // TODO: call super() with statusCode 400 and code "VALIDATION_ERROR"
    super(message, 500, "TODO");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    // TODO: call super() with statusCode 404 and code "NOT_FOUND"
    super(message, 500, "TODO");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Not authenticated") {
    // TODO: call super() with statusCode 401 and code "UNAUTHORIZED"
    super(message, 500, "TODO");
  }
}
