import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../types";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: any = null;

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    details = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
  }
  // Custom API errors
  else if (error.status) {
    statusCode = error.status;
    message = error.message;
  }
  // Prisma errors
  else if (error.code) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Resource not found";
        break;
      default:
        statusCode = 500;
        message = "Database error";
    }
  }
  // JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
