import { Router, Request, Response } from "express";
import AuthService from "../services/authService";
import { authenticate, requireEmailVerification } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import EmailService from "../services/emailService";
import {
  authRateLimit,
  verificationRateLimit,
  emailRateLimit,
} from "../middleware/rateLimit";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  onlineStatusSchema,
  resendVerificationSchema,
  adminResetPasswordSchema,
} from "../schemas/validation";

const router = Router();

// Register
router.post(
  "/register",
  emailRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);

    res.status(result.success ? 201 : 400).json(result);
  })
);

// Login
router.post(
  "/login",
  authRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    if (result.success && result.token && result.refreshToken) {
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

    res.status(result.success ? 200 : 401).json(result);
  })
);

// Verify Email
router.post(
  "/verify-email",
  verificationRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = verifyEmailSchema.parse(req.body);
    const result = await AuthService.verifyEmail(validatedData);

    res.status(result.success ? 200 : 400).json(result);
  })
);

// Forgot Password
router.post(
  "/forgot-password",
  emailRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await AuthService.forgotPassword(validatedData);

    res.status(200).json(result);
  })
);

// Reset Password
router.post(
  "/reset-password",
  verificationRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(validatedData);

    res.status(result.success ? 200 : 400).json(result);
  })
);

// Refresh Token
router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    if (result.success && result.token && result.refreshToken) {
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

    return res.status(result.success ? 200 : 401).json(result);
  })
);

// Logout
router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await AuthService.logout(req.user.sessionId);

    // Clear cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res.status(200).json(result);
  })
);

// Get Profile
router.get(
  "/profile",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await AuthService.getUserProfile(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  })
);

// Update Profile
router.put(
  "/profile",
  authenticate,
  requireEmailVerification,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const validatedData = updateProfileSchema.parse(req.body);
    const result = await AuthService.updateProfile(
      req.user.userId,
      validatedData
    );

    return res.status(result.success ? 200 : 400).json(result);
  })
);

// Update Online Status
router.put(
  "/online-status",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const validatedData = onlineStatusSchema.parse(req.body);
    await AuthService.updateOnlineStatus(
      req.user.userId,
      validatedData.isOnline
    );

    return res.status(200).json({
      success: true,
      message: "Online status updated successfully",
    });
  })
);

// Resend Email Verification
router.post(
  "/resend-verification",
  emailRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = resendVerificationSchema.parse(req.body);
    const result = await AuthService.resendVerificationCode(
      validatedData.email
    );

    return res.status(result.success ? 200 : 400).json(result);
  })
);

// Admin Reset Password (Admin only)
router.post(
  "/admin/reset-password",
  authenticate,
  verificationRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const validatedData = adminResetPasswordSchema.parse(req.body);
    const result = await AuthService.adminResetPassword(
      req.user.userId,
      validatedData.targetEmail,
      validatedData.newPassword
    );

    return res.status(result.success ? 200 : 403).json(result);
  })
);

export default router;

// Email service health check endpoint
router.get(
  "/email-health",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const isConnected = await EmailService.testConnection();
      res.json({
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
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to test email connection",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  })
);
