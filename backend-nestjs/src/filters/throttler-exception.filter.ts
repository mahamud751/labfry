import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Response } from "express";

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Get the endpoint path to determine the appropriate message
    const path = request.url;

    let message = "Too many requests. Please try again in 1 minute.";
    let retryAfter = 60; // Default to 60 seconds

    // Customize message based on endpoint
    if (path.includes("/auth/login")) {
      message = "Too many login attempts. Please try again in 1 minute.";
      retryAfter = 60;
    } else if (path.includes("/auth/register")) {
      message =
        "Too many registration attempts. Please try again in 5 minutes.";
      retryAfter = 300;
    } else if (
      path.includes("/auth/forgot-password") ||
      path.includes("/auth/resend-verification")
    ) {
      message = "Too many email requests. Please try again in 5 minutes.";
      retryAfter = 300;
    } else if (
      path.includes("/auth/verify-email") ||
      path.includes("/auth/reset-password")
    ) {
      message = "Too many verification attempts. Please try again in 1 minute.";
      retryAfter = 60;
    }

    response
      .status(HttpStatus.TOO_MANY_REQUESTS)
      .setHeader("Retry-After", retryAfter)
      .json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        error: "Too Many Requests",
        retryAfter,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
