// app/reset-password/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { resetPassword, clearError } from "../../src/store/slices/authSlice";
import { useRateLimit } from "../../src/hooks/useRateLimit";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Button from "../components/Button";

// Create a client component that uses useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { isRateLimited, countdown, handleRateLimitError, countdownText } =
    useRateLimit();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");
  const verified = searchParams.get("verified");
  const code = searchParams.get("code"); // Get the verification code from URL

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      const isRateLimitError = handleRateLimitError(error);
      if (!isRateLimitError) {
        const errorMessage =
          typeof error === "string" ? error : "An error occurred";
        toast.error(errorMessage);
      }
      dispatch(clearError());
    }
  }, [error, dispatch, handleRateLimitError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      let resetData;

      if (token) {
        // Token-based reset (from email link)
        resetData = {
          token,
          password: formData.newPassword,
        };
      } else if (code && email) {
        // Code-based reset (from verification page)
        resetData = {
          code,
          email,
          password: formData.newPassword,
        };
      } else if (verified === "true" && email) {
        // Legacy: Code was already verified, use email
        resetData = {
          email,
          password: formData.newPassword,
        };
      } else if (formData.verificationCode && email) {
        // Manual code entry
        resetData = {
          code: formData.verificationCode,
          email,
          password: formData.newPassword,
        };
      } else {
        toast.error(
          "Missing verification information. Please start the password reset process again."
        );
        return;
      }

      const result = await dispatch(resetPassword(resetData)).unwrap();
      if (result.success) {
        toast.success("Password reset successfully!");
        router.push("/success?type=password");
      }
    } catch (error: any) {
      // Error is already handled by the slice and toast
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-primary-white px-4 py-8">
      {/* Logo */}
      <div className="mb-12 md:mb-16">
        <Link href="/">
          <Image
            src="/labfry-logo.png"
            alt="Labfry"
            width={182}
            height={98}
            className="w-28 md:w-32 h-auto"
            priority
          />
        </Link>
      </div>

      {/* Content Container */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary-black mb-4">
            Enter your new password
          </h1>
          <p className="text-primary-gray leading-relaxed">
            {code
              ? "Your verification code has been confirmed. Please enter your new password."
              : token
              ? "Please enter your new password to complete the reset process."
              : "Please enter your new password and confirm it to complete the reset process."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show verification code field if needed */}
          {!token && !code && verified !== "true" && (
            <FloatingLabelInput
              id="verificationCode"
              name="verificationCode"
              type="text"
              value={formData.verificationCode}
              onChange={handleChange}
              label="Verification Code"
              placeholder="Enter 6-digit code from email"
              required
            />
          )}

          {/* New Password Field */}
          <FloatingLabelInput
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            label="New Password"
            placeholder="New password"
            showPasswordToggle
            required
          />

          {/* Confirm Password Field */}
          <FloatingLabelInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="Confirm password"
            showPasswordToggle
            required
          />

          {/* Reset Password Button */}
          <Button
            type="submit"
            variant="primary"
            className="mt-6 py-3.5 rounded-lg"
            disabled={isLoading || isRateLimited}
          >
            {isLoading
              ? "Resetting Password..."
              : isRateLimited
              ? `Wait ${countdownText}`
              : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-white px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
            <p className="text-primary-gray">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
