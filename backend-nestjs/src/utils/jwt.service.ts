import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

@Injectable()
export class JWTService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.configService.get("JWT_SECRET"), {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.configService.get("JWT_REFRESH_SECRET"), {
      expiresIn: "7d",
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      if (!token) {
        throw new Error("Token is required");
      }
      return jwt.verify(
        token,
        this.configService.get("JWT_SECRET")
      ) as JWTPayload;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token format");
      } else if (error.message === "Token is required") {
        throw error;
      } else {
        throw new Error("Invalid or expired token");
      }
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(
        token,
        this.configService.get("JWT_REFRESH_SECRET")
      ) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  generateEmailVerificationToken(email: string): string {
    return jwt.sign(
      { email },
      this.configService.get("EMAIL_VERIFICATION_SECRET"),
      {
        expiresIn: "24h",
      }
    );
  }

  verifyEmailVerificationToken(token: string): { email: string } {
    try {
      return jwt.verify(
        token,
        this.configService.get("EMAIL_VERIFICATION_SECRET")
      ) as {
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired email verification token");
    }
  }

  generatePasswordResetToken(email: string): string {
    return jwt.sign(
      { email },
      this.configService.get("PASSWORD_RESET_SECRET"),
      {
        expiresIn: "1h",
      }
    );
  }

  verifyPasswordResetToken(token: string): { email: string } {
    try {
      return jwt.verify(
        token,
        this.configService.get("PASSWORD_RESET_SECRET")
      ) as {
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired password reset token");
    }
  }
}
