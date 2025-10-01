import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { JWTPayload } from "../types";

export class JWTUtil {
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  static generateEmailVerificationToken(email: string): string {
    return jwt.sign({ email }, config.EMAIL_VERIFICATION_SECRET, {
      expiresIn: "24h",
    });
  }

  static verifyEmailVerificationToken(token: string): { email: string } {
    try {
      return jwt.verify(token, config.EMAIL_VERIFICATION_SECRET) as {
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired email verification token");
    }
  }

  static generatePasswordResetToken(email: string): string {
    return jwt.sign({ email }, config.PASSWORD_RESET_SECRET, {
      expiresIn: "1h",
    });
  }

  static verifyPasswordResetToken(token: string): { email: string } {
    try {
      return jwt.verify(token, config.PASSWORD_RESET_SECRET) as {
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired password reset token");
    }
  }
}
