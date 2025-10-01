import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JWTService } from "../utils/jwt.service";
import { PrismaService } from "../prisma/prisma.service";
import { JWTPayload } from "../types";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      throw new UnauthorizedException("Access token is required");
    }

    try {
      // Verify the token
      const payload = this.jwtService.verifyToken(token);

      // Check if session is still active
      const session = await this.prisma.session.findUnique({
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
        throw new UnauthorizedException("Session expired or invalid");
      }

      if (session.user.status !== "ACTIVE") {
        throw new ForbiddenException("Account is not active");
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }

    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true },
    });

    if (!userRecord?.emailVerified) {
      throw new ForbiddenException("Email verification required");
    }

    return true;
  }
}
