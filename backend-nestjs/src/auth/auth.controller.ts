import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JWTService } from "../utils/jwt.service";
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  AdminResetPasswordDto,
} from "./dto/auth.dto";
import {
  AuthResponseDto,
  ErrorResponseDto,
  RateLimitResponseDto,
} from "./dto/response.dto";
import { EmailService } from "../email/email.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JWTService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "User registration",
    description: "Register a new user account with email verification",
  })
  @ApiResponse({
    status: 201,
    description: "Registration successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Registration failed - validation errors or user exists",
    type: ErrorResponseDto,
  })
  @Throttle({ default: { limit: 2, ttl: 300000 } }) // 2 requests per 5 minutes
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "User authentication login",
    description: "Authenticate user with email and password",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Login failed - invalid credentials or account issues",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests. Please try again in 1 minute.",
    type: RateLimitResponseDto,
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 attempts per 1 minute (60 seconds)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);

    // Set appropriate HTTP status code based on result
    if (!result.success) {
      res.status(HttpStatus.UNAUTHORIZED);
      return result;
    }

    // Login successful - set status 200 and cookies
    res.status(HttpStatus.OK);

    if (result.token && result.refreshToken) {
      // Set HTTP-only cookies for tokens
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return result;
  }

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Verify user email address",
    description:
      "Verify user email address using either a JWT token or 6-digit code",
  })
  @ApiResponse({
    status: 200,
    description: "Email verified successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Email verification failed",
    type: ErrorResponseDto,
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto
  ): Promise<AuthResponseDto> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Request password reset",
    description: "Send password reset code to user email address",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset email sent (always returned for security)",
    type: AuthResponseDto,
  })
  @Throttle({ default: { limit: 2, ttl: 300000 } }) // 2 requests per 5 minutes
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<AuthResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Reset user password",
    description: "Reset user password using token or code from email",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Password reset failed",
    type: ErrorResponseDto,
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<AuthResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post("refresh")
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Refresh authentication token",
    description: "Get new access token using refresh token",
  })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Token refresh failed",
    type: ErrorResponseDto,
  })
  async refreshToken(
    @Req() req: Request,
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const refreshToken = req.cookies?.refreshToken || body.refreshToken;

    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED);
      return {
        success: false,
        message: "Refresh token is required",
      };
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set appropriate HTTP status code based on result
    if (!result.success) {
      res.status(HttpStatus.UNAUTHORIZED);
      return result;
    }

    // Refresh successful - set status 200 and update cookies
    res.status(HttpStatus.OK);

    if (result.token && result.refreshToken) {
      // Update cookies with new tokens
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return result;
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "User logout",
    description: "Logout user and invalidate session",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
    type: AuthResponseDto,
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      let sessionId = null;

      // Try to extract sessionId from token if available
      if (token) {
        try {
          const payload = this.jwtService.verifyToken(token);
          sessionId = payload.sessionId;
        } catch (error) {
          // Token is invalid/expired, but we can still logout by clearing cookies
          console.log(
            "Invalid token during logout, proceeding with cookie cleanup"
          );
        }
      }

      // Attempt to invalidate session if we have a sessionId
      if (sessionId) {
        try {
          await this.authService.logout(sessionId);
        } catch (error) {
          // Session invalidation failed, but we can still clear cookies
          console.error("Session invalidation failed:", error);
        }
      }

      // Always clear cookies regardless of session invalidation result
      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);

      // Even if there's an error, clear cookies for security
      res.clearCookie("token");
      res.clearCookie("refreshToken");

      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get user profile",
    description: "Get authenticated user profile information",
  })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication required",
    type: ErrorResponseDto,
  })
  async getProfile(@Req() req: Request): Promise<AuthResponseDto> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        return {
          success: false,
          message: "Authentication required",
        };
      }

      // Verify and decode the token to get userId
      let payload;
      try {
        payload = this.jwtService.verifyToken(token);
      } catch (error) {
        return {
          success: false,
          message: "Invalid or expired token",
        };
      }

      // Get user profile using the userId from token
      const user = await this.authService.getUserProfile(payload.userId);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "Profile retrieved successfully",
        user,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: "Authentication failed",
      };
    }
  }

  @Put("profile")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: "Update user profile",
    description: "Update authenticated user profile information",
  })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication required",
    type: ErrorResponseDto,
  })
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<AuthResponseDto> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        return {
          success: false,
          message: "Authentication required",
        };
      }

      // Verify and decode the token to get userId
      let payload;
      try {
        payload = this.jwtService.verifyToken(token);
      } catch (error) {
        return {
          success: false,
          message: "Invalid or expired token",
        };
      }

      // Update profile using the userId from token
      return this.authService.updateProfile(payload.userId, updateProfileDto);
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: "Authentication failed",
      };
    }
  }

  @Put("online-status")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: "Update online status",
    description: "Update user online/offline status",
  })
  @ApiResponse({
    status: 200,
    description: "Online status updated successfully",
    type: AuthResponseDto,
  })
  async updateOnlineStatus(
    @Req() req: Request,
    @Body() onlineStatusDto: { isOnline: boolean }
  ): Promise<AuthResponseDto> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (!token) {
        return {
          success: false,
          message: "Authentication required",
        };
      }

      // Verify and decode the token to get userId
      let payload;
      try {
        payload = this.jwtService.verifyToken(token);
      } catch (error) {
        return {
          success: false,
          message: "Invalid or expired token",
        };
      }

      // Update online status using the userId from token
      await this.authService.updateOnlineStatus(
        payload.userId,
        onlineStatusDto.isOnline
      );

      return {
        success: true,
        message: "Online status updated successfully",
      };
    } catch (error) {
      console.error("Update online status error:", error);
      return {
        success: false,
        message: "Failed to update online status",
      };
    }
  }

  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Resend email verification",
    description: "Send new verification code to user email",
  })
  @ApiResponse({
    status: 200,
    description: "Verification code sent",
    type: AuthResponseDto,
  })
  @Throttle({ default: { limit: 2, ttl: 300000 } }) // 2 requests per 5 minutes
  async resendVerification(
    @Body() resendDto: { email: string }
  ): Promise<AuthResponseDto> {
    return this.authService.resendVerificationCode(resendDto.email);
  }

  @Post("admin/reset-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: "Admin reset password",
    description: "Admin function to reset user password",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required",
    type: ErrorResponseDto,
  })
  async adminResetPassword(
    @Req() req: Request,
    @Body() adminResetDto: AdminResetPasswordDto
  ): Promise<AuthResponseDto> {
    // TODO: Implement proper authentication guard
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    // TODO: Extract userId from token properly
    const adminUserId = req.body.adminUserId || "temp-admin-id";
    return this.authService.adminResetPassword(
      adminUserId,
      adminResetDto.targetEmail,
      adminResetDto.newPassword
    );
  }

  @Get("email-health")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Email service health check",
    description: "Check email service connectivity and configuration",
  })
  @ApiResponse({
    status: 200,
    description: "Email service status",
  })
  async emailHealthCheck(): Promise<any> {
    try {
      const isConnected = await this.emailService.testConnection();
      return {
        success: isConnected,
        message: isConnected
          ? "Email service is working correctly"
          : "Email service connection failed",
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? "***configured***" : "missing",
          from: process.env.FROM_EMAIL,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to test email connection",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
