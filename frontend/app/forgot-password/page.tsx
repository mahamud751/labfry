// app/forgot-password/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { forgotPassword, clearError } from "../../src/store/slices/authSlice";
import { useRateLimit } from "../../src/hooks/useRateLimit";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Button from "../components/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { isRateLimited, countdown, handleRateLimitError, countdownText } =
    useRateLimit();

  const [email, setEmail] = useState("");

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

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();
      if (result.success) {
        toast.success(
          "Reset code sent to your email! Please check your inbox (and spam folder)."
        );
        router.push(`/verify?email=${encodeURIComponent(email)}&type=password`);
      }
    } catch (error: any) {
      // Check if it's an email configuration issue
      if (error?.message?.includes("Failed to send")) {
        toast.error(
          "Email service is not configured properly. Please contact support."
        );
      }
      // Error is already handled by the slice and toast
    }
  };

  // Add the missing handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
            Forgot your password?
          </h1>
          <p className="text-primary-gray leading-relaxed">
            Please enter the email address associated with your account, and
            we&apos;ll email you a 6-digit verification code to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="Email address"
            required
          />

          {/* Reset Password Button */}
          <Button
            type="submit"
            variant="primary"
            className="mt-1 py-3.5 rounded-lg"
            disabled={isLoading || isRateLimited}
          >
            {isLoading
              ? "Sending Code..."
              : isRateLimited
              ? `Wait ${countdownText}`
              : "Send Reset Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
