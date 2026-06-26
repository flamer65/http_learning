import { AppError } from "../../src/utils/AppError";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Not authenticated") {
    super(message, 401, "UNAUTHORIZED");
  }
}
