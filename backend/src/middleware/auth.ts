import { Request, Response, NextFunction } from "express";
import { JWTUtil } from "../utils/jwt";
import Database from "../utils/database";
import { JWTPayload } from "../types";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    // Verify the token
    const payload = JWTUtil.verifyToken(token);

    // Check if session is still active
    const prisma = Database.getInstance();
    const session = await prisma.session.findUnique({
      where: {
        id: payload.sessionId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!session || new Date() > session.expiresAt) {
      res.status(401).json({
        success: false,
        message: "Session expired or invalid",
      });
      return;
    }

    if (session.user.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Account is not active",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export const requireEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const prisma = Database.getInstance();
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { emailVerified: true },
    });

    if (!user?.emailVerified) {
      res.status(403).json({
        success: false,
        message: "Email verification required",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
