// app/verify/VerifyContent.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { verifyEmail, clearError } from "../../src/store/slices/authSlice";
import { useRateLimit } from "../../src/hooks/useRateLimit";
import Button from "../components/Button";
import api from "../../src/lib/axios";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { isRateLimited, countdown, handleRateLimitError, countdownText } =
    useRateLimit();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());

    // If token is provided, try automatic verification first
    if (token && !email) {
      handleTokenVerification();
    } else {
      // Focus first input for code entry
      inputRefs.current[0]?.focus();
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Handle cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Show error toast
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

  const handleTokenVerification = async () => {
    if (!token) return;

    try {
      const result = await dispatch(verifyEmail({ token })).unwrap();
      if (result.success) {
        toast.success("Email verified successfully!");
        router.push("/success?type=verification");
      }
    } catch (error: any) {
      toast.error(error || "Verification failed");
    }
  };

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCodes = [...codes];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newCodes[index] = char;
      }
    });
    setCodes(newCodes);

    // Focus last filled input or first empty one
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = codes.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email is required for code verification");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if this is for password reset or account verification
      if (type === "password") {
        // For password reset, redirect directly to reset password page with the code
        toast.success("Code verified! Please set your new password.");
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&code=${code}`
        );
      } else {
        // For email verification, use the regular verify endpoint
        const result = await dispatch(
          verifyEmail({
            code,
            email,
          })
        ).unwrap();

        if (result.success) {
          toast.success("Email verified successfully!");
          router.push("/success?type=verification");
        }
      }
    } catch (error: any) {
      toast.error(error || "Verification failed");
      // Clear the code inputs on error
      setCodes(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend verification code");
      return;
    }

    if (resendCooldown > 0) {
      toast.error(
        `Please wait ${resendCooldown} seconds before requesting again`
      );
      return;
    }

    try {
      let response;
      if (type === "password") {
        // For password reset, resend password reset code
        response = await api.post("/auth/forgot-password", { email });
      } else {
        // For email verification, resend verification code
        response = await api.post("/auth/resend-verification", { email });
      }

      if (response.data.success) {
        toast.success(
          type === "password"
            ? "Password reset code sent to your email!"
            : "Verification code sent to your email!"
        );
        setResendCooldown(60); // 60 second cooldown
        // Clear current codes
        setCodes(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      // Handle rate limit error
      const isRateLimitError = handleRateLimitError(error);
      if (!isRateLimitError) {
        toast.error(error.response?.data?.message || "Failed to resend code");
      }
    }
  };

  const isVerifyDisabled =
    codes.some((code) => !code) || isSubmitting || isLoading;

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
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-black mb-4 leading-tight">
          {type === "password"
            ? "Password Reset Verification"
            : "Please check your email!"}
        </h1>
        <p className="text-primary-gray mb-8 md:mb-10 leading-relaxed">
          We&apos;ve emailed a 6-digit{" "}
          {type === "password" ? "reset" : "confirmation"} code to{" "}
          <span className="font-medium text-primary-black">{email}</span>,
          please enter the code in below box to{" "}
          {type === "password"
            ? "continue with password reset"
            : "verify your email"}
          .
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 md:gap-3 mb-8">
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 md:w-14 md:h-14 text-center border border-border-light rounded-lg placeholder:text-primary-black focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all text-lg font-semibold"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          variant="primary"
          className="py-3.5 rounded-lg mb-6"
          disabled={isVerifyDisabled}
        >
          {isSubmitting || isLoading
            ? "Verifying..."
            : type === "password"
            ? "Continue to Reset Password"
            : "Verify"}
        </Button>

        {/* Resend Code */}
        <p className="text-primary-black text-sm">
          Don&apos;t have a code?{" "}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isRateLimited}
            className={`font-semibold transition-colors ${
              resendCooldown > 0 || isRateLimited
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary-red hover:text-red-600 cursor-pointer"
            }`}
          >
            {isRateLimited
              ? `Wait ${countdownText}`
              : resendCooldown > 0
              ? `Resend code (${resendCooldown}s)`
              : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}
