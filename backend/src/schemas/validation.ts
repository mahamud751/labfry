import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z
    .string()
    .optional()
    .default("USER")
    .transform((val) => val.toUpperCase())
    .refine((val) => ["ADMIN", "USER", "CUSTOMER"].includes(val), {
      message: "Invalid role. Must be one of: ADMIN, USER, CUSTOMER",
    }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Verification token is required").optional(),
    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must contain only numbers")
      .optional(),
    email: z.string().email("Valid email is required").optional(),
  })
  .refine((data) => data.token || (data.code && data.email), {
    message: "Either token or both code and email are required",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required").optional(),
    code: z
      .string()
      .length(6, "Reset code must be 6 digits")
      .regex(/^\d{6}$/, "Reset code must contain only numbers")
      .optional(),
    email: z.string().email("Valid email is required").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.token || (data.code && data.email), {
    message: "Either token or both code and email are required",
  });

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const onlineStatusSchema = z.object({
  isOnline: z.boolean(),
});

// Admin reset password schema
export const adminResetPasswordSchema = z.object({
  targetEmail: z.string().email("Please enter a valid email address"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type OnlineStatusInput = z.infer<typeof onlineStatusSchema>;
export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;
