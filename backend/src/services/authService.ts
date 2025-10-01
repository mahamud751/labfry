import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import Database from "../utils/database";
import { JWTUtil } from "../utils/jwt";
import {
  generateVerificationCode,
  getCodeExpiryTime,
  isCodeExpired,
  isValidCodeFormat,
} from "../utils/verification";
import EmailService from "./emailService";
import { config } from "../config";
import {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  AdminResetPasswordInput,
} from "../schemas/validation";
import { AuthResponse, User } from "../types";

class AuthService {
  private prisma = Database.getInstance();

  async register(data: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Generate email verification token and code
      const emailVerificationToken = JWTUtil.generateEmailVerificationToken(
        data.email
      );
      const emailVerificationCode = generateVerificationCode();

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: (data.role as "ADMIN" | "USER" | "CUSTOMER") || "USER",
          emailVerificationToken,
          emailVerificationTokenExpiry: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ), // 24 hours
          emailVerificationCode,
          emailVerificationCodeExpiry: getCodeExpiryTime(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          isOnline: true,
          lastSeen: true,
        },
      });

      // Send verification email with code
      await EmailService.sendEmailVerification(
        data.email,
        emailVerificationToken,
        data.firstName,
        emailVerificationCode
      );

      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
        user,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed");
    }
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check account status
      if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") {
        return {
          success: false,
          message: "Account is suspended or deleted",
        };
      }

      // Create session
      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + config.SESSION_EXPIRE_TIME);
      const refreshExpiresAt = new Date(
        Date.now() + config.REFRESH_SESSION_EXPIRE_TIME
      );

      // JWT payload
      const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
      };

      // Generate tokens
      const token = JWTUtil.generateToken(jwtPayload);
      const refreshToken = JWTUtil.generateRefreshToken(jwtPayload);

      // Save session to database (let Prisma auto-generate ObjectID)
      const session = await this.prisma.session.create({
        data: {
          userId: user.id,
          token,
          refreshToken,
          expiresAt: data.rememberMe ? refreshExpiresAt : expiresAt,
        },
      });

      // Update JWT payload with the actual session ID from database
      const updatedJwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: session.id,
      };

      // Regenerate tokens with the correct session ID
      const finalToken = JWTUtil.generateToken(updatedJwtPayload);
      const finalRefreshToken = JWTUtil.generateRefreshToken(updatedJwtPayload);

      // Update the session with the new tokens
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: finalToken,
          refreshToken: finalRefreshToken,
        },
      });

      // Update user online status
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isOnline: true,
          lastSeen: new Date(),
        },
      });

      const userResponse: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        message: "Login successful",
        user: userResponse,
        token: finalToken,
        refreshToken: finalRefreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  }

  async verifyEmail(data: VerifyEmailInput): Promise<AuthResponse> {
    try {
      let user;

      // Handle token-based verification
      if (data.token) {
        const { email } = JWTUtil.verifyEmailVerificationToken(data.token);
        user = await this.prisma.user.findUnique({
          where: { email },
        });
      }
      // Handle code-based verification
      else if (data.code && data.email) {
        if (!isValidCodeFormat(data.code)) {
          return {
            success: false,
            message: "Invalid verification code format",
          };
        }

        user = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user || user.emailVerificationCode !== data.code) {
          return {
            success: false,
            message: "Invalid verification code",
          };
        }

        // Check code expiry
        if (isCodeExpired(user.emailVerificationCodeExpiry)) {
          return {
            success: false,
            message: "Verification code has expired",
          };
        }
      } else {
        return {
          success: false,
          message: "Either token or code with email is required",
        };
      }

      if (!user) {
        return {
          success: false,
          message: "Invalid verification token or code",
        };
      }

      if (user.emailVerified) {
        return {
          success: false,
          message: "Email is already verified",
        };
      }

      // Check token expiry (if using token)
      if (
        data.token &&
        user.emailVerificationTokenExpiry &&
        new Date() > user.emailVerificationTokenExpiry
      ) {
        return {
          success: false,
          message: "Verification token has expired",
        };
      }

      // Update user
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          status: "ACTIVE",
          emailVerificationToken: null,
          emailVerificationTokenExpiry: null,
          emailVerificationCode: null,
          emailVerificationCodeExpiry: null,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          isOnline: true,
          lastSeen: true,
        },
      });

      // Send welcome email
      await EmailService.sendWelcomeEmail(user.email, user.firstName);

      return {
        success: true,
        message: "Email verified successfully",
        user: updatedUser,
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: "Invalid or expired verification token or code",
      };
    }
  }

  async forgotPassword(data: ForgotPasswordInput): Promise<AuthResponse> {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message:
            "If an account with this email exists, a password reset link has been sent.",
        };
      }

      // Generate reset token and code
      const resetToken = JWTUtil.generatePasswordResetToken(data.email);
      const resetCode = generateVerificationCode();

      // Update user with reset token and code
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          passwordResetCode: resetCode,
          passwordResetCodeExpiry: getCodeExpiryTime(),
        },
      });

      // Send reset email with code
      await EmailService.sendPasswordReset(
        data.email,
        resetToken,
        user.firstName,
        resetCode
      );

      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw new Error("Failed to process password reset request");
    }
  }

  async resetPassword(data: ResetPasswordInput): Promise<AuthResponse> {
    try {
      let user;

      // Handle token-based reset
      if (data.token) {
        const { email } = JWTUtil.verifyPasswordResetToken(data.token);
        user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.passwordResetToken !== data.token) {
          return {
            success: false,
            message: "Invalid or expired reset token",
          };
        }

        // Check token expiry
        if (
          user.passwordResetTokenExpiry &&
          new Date() > user.passwordResetTokenExpiry
        ) {
          return {
            success: false,
            message: "Reset token has expired",
          };
        }
      }
      // Handle code-based reset
      else if (data.code && data.email) {
        if (!isValidCodeFormat(data.code)) {
          return {
            success: false,
            message: "Invalid reset code format",
          };
        }

        user = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user || user.passwordResetCode !== data.code) {
          return {
            success: false,
            message: "Invalid reset code",
          };
        }

        // Check code expiry
        if (isCodeExpired(user.passwordResetCodeExpiry)) {
          return {
            success: false,
            message: "Reset code has expired",
          };
        }
      } else {
        return {
          success: false,
          message: "Either token or code with email is required",
        };
      }

      if (!user) {
        return {
          success: false,
          message: "Invalid reset token or code",
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Update user
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
          passwordResetCode: null,
          passwordResetCodeExpiry: null,
        },
      });

      // Invalidate all sessions
      await this.prisma.session.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      });

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Invalid or expired reset token or code",
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      // Find session
      const session = await this.prisma.session.findUnique({
        where: {
          id: payload.sessionId,
          refreshToken,
          isActive: true,
        },
        include: {
          user: true,
        },
      });

      if (!session || new Date() > session.expiresAt) {
        return {
          success: false,
          message: "Invalid or expired refresh token",
        };
      }

      // Generate new tokens
      const newJwtPayload = {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        sessionId: session.id,
      };

      const newToken = JWTUtil.generateToken(newJwtPayload);
      const newRefreshToken = JWTUtil.generateRefreshToken(newJwtPayload);

      // Update session
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });

      const userResponse: User = {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        status: session.user.status,
        emailVerified: session.user.emailVerified,
        isOnline: session.user.isOnline,
        lastSeen: session.user.lastSeen,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };

      return {
        success: true,
        message: "Token refreshed successfully",
        user: userResponse,
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      return {
        success: false,
        message: "Invalid or expired refresh token",
      };
    }
  }

  async logout(sessionId: string): Promise<AuthResponse> {
    try {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<AuthResponse> {
    try {
      // Check if email is being changed and if it already exists
      if (data.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            NOT: { id: userId },
          },
        });

        if (existingUser) {
          return {
            success: false,
            message: "Email is already in use",
          };
        }
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          isOnline: true,
          lastSeen: true,
        },
      });

      return {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      };
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error("Failed to update profile");
    }
  }

  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isOnline,
          lastSeen: new Date(),
        },
      });
    } catch (error) {
      console.error("Update online status error:", error);
    }
  }

  async resendVerificationCode(email: string): Promise<AuthResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      if (user.emailVerified) {
        return {
          success: false,
          message: "Email is already verified",
        };
      }

      // Generate new verification code and token
      const emailVerificationCode = generateVerificationCode();
      const emailVerificationToken =
        JWTUtil.generateEmailVerificationToken(email);

      // Update user with new code and token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationCode,
          emailVerificationCodeExpiry: getCodeExpiryTime(),
          emailVerificationToken,
          emailVerificationTokenExpiry: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ),
        },
      });

      // Send new verification email with code
      await EmailService.sendEmailVerification(
        email,
        emailVerificationToken,
        user.firstName,
        emailVerificationCode
      );

      return {
        success: true,
        message: "New verification code sent to your email",
      };
    } catch (error) {
      console.error("Resend verification code error:", error);
      return {
        success: false,
        message: "Failed to send verification code",
      };
    }
  }

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          isOnline: true,
          lastSeen: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  }

  // Admin function to force reset user password from backend
  async adminResetPassword(
    adminUserId: string,
    targetEmail: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      // Verify admin has permission
      const adminUser = await this.prisma.user.findUnique({
        where: { id: adminUserId },
      });

      if (!adminUser || adminUser.role !== "ADMIN") {
        return {
          success: false,
          message: "Unauthorized: Admin access required",
        };
      }

      // Find target user
      const targetUser = await this.prisma.user.findUnique({
        where: { email: targetEmail },
      });

      if (!targetUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password and clear any reset tokens
      await this.prisma.user.update({
        where: { id: targetUser.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
          passwordResetCode: null,
          passwordResetCodeExpiry: null,
        },
      });

      // Invalidate all sessions for the target user
      await this.prisma.session.updateMany({
        where: { userId: targetUser.id },
        data: { isActive: false },
      });

      console.log(
        `✅ Admin ${adminUser.email} reset password for user ${targetUser.email}`
      );

      return {
        success: true,
        message: `Password reset successfully for ${targetUser.email}`,
      };
    } catch (error) {
      console.error("Admin reset password error:", error);
      return {
        success: false,
        message: "Failed to reset password",
      };
    }
  }
}

export default new AuthService();
