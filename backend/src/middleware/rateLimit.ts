import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Helper function to calculate retry time
function getRetryTime(
  windowMs: number,
  req: Request
): { retryAfter: number; message: string } {
  const resetTime = new Date(Date.now() + windowMs);
  const now = new Date();
  const retryAfterMs = resetTime.getTime() - now.getTime();
  const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
  const retryAfterMinutes = Math.ceil(retryAfterSeconds / 60);

  let message: string;
  if (retryAfterSeconds < 60) {
    message = `Too many requests. Please try again in ${retryAfterSeconds} second${
      retryAfterSeconds !== 1 ? "s" : ""
    }.`;
  } else if (retryAfterMinutes < 60) {
    message = `Too many requests. Please try again in ${retryAfterMinutes} minute${
      retryAfterMinutes !== 1 ? "s" : ""
    }.`;
  } else {
    const retryAfterHours = Math.ceil(retryAfterMinutes / 60);
    message = `Too many requests. Please try again in ${retryAfterHours} hour${
      retryAfterHours !== 1 ? "s" : ""
    }.`;
  }

  return {
    retryAfter: retryAfterSeconds,
    message,
  };
}

// Rate limiter for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per windowMs (changed from 5 to 3)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    const { retryAfter, message } = getRetryTime(1 * 60 * 1000, req);

    res.set("Retry-After", retryAfter.toString());
    res.status(429).json({
      success: false,
      message,
      retryAfter,
      retryAfterMs: retryAfter * 1000,
      timestamp: new Date().toISOString(),
    });
  },
});

// Rate limiter for registration/verification endpoints (stricter)
export const verificationRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute (changed from 15 minutes)
  max: 5, // Limit each IP to 5 verification attempts per windowMs (increased from 3)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const { retryAfter, message } = getRetryTime(1 * 60 * 1000, req);

    res.set("Retry-After", retryAfter.toString());
    res.status(429).json({
      success: false,
      message: message.replace(
        "Too many requests",
        "Too many verification attempts"
      ),
      retryAfter,
      retryAfterMs: retryAfter * 1000,
      timestamp: new Date().toISOString(),
    });
  },
});

// Rate limiter for email sending (very strict)
export const emailRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // Limit each IP to 2 email requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const { retryAfter, message } = getRetryTime(5 * 60 * 1000, req);

    res.set("Retry-After", retryAfter.toString());
    res.status(429).json({
      success: false,
      message: message.replace("Too many requests", "Too many email requests"),
      retryAfter,
      retryAfterMs: retryAfter * 1000,
      timestamp: new Date().toISOString(),
    });
  },
});

// General rate limiter for all requests
export const generalRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute (changed from 15 minutes)
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const { retryAfter, message } = getRetryTime(1 * 60 * 1000, req);

    res.set("Retry-After", retryAfter.toString());
    res.status(429).json({
      success: false,
      message,
      retryAfter,
      retryAfterMs: retryAfter * 1000,
      timestamp: new Date().toISOString(),
    });
  },
});
