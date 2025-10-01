// app/register/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { registerUser, clearError } from "../../src/store/slices/authSlice";
import { useRateLimit } from "../../src/hooks/useRateLimit";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Button from "../components/Button";

// Create a client component that uses useSearchParams
function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { isRateLimited, countdown, handleRateLimitError, countdownText } =
    useRateLimit();

  const role = searchParams.get("role");

  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: (role as "ADMIN" | "USER" | "CUSTOMER") || "USER",
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

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        })
      ).unwrap();

      if (result.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        router.push(
          `/verify?email=${encodeURIComponent(formData.email)}&type=account`
        );
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

      {/* Form Container */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary-black mb-2">
            Create your Account
          </h1>
          <p className="text-primary-gray leading-relaxed">
            When sports Meets smart Tech.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              label="First Name"
              placeholder="Meraj"
              required
            />
            <FloatingLabelInput
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              label="Last Name"
              placeholder="Last name"
              required
            />
          </div>

          {/* Email Field */}
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            placeholder="Email address"
            required
          />

          {/* Password Field */}
          <FloatingLabelInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            placeholder="Password"
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
            placeholder="Confirm Password"
            showPasswordToggle
            required
          />

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-primary-red rounded accent-primary-red"
              required
            />
            <label htmlFor="terms" className="text-sm text-primary-gray">
              I agree to Tech Takes Terms of Service and Privacy Policy.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="mt-6 py-3.5 rounded-lg"
            disabled={isLoading || !agreed || isRateLimited}
          >
            {isLoading
              ? "Creating Account..."
              : isRateLimited
              ? `Wait ${countdownText}`
              : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8 mt-16 md:mt-24">
          <div className="flex-1 h-px bg-divider"></div>
          <span className="text-sm text-primary-gray">OR</span>
          <div className="flex-1 h-px bg-divider"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-primary-black font-be-vietnam">
          Don&apos;t have an account?{" "}
          <Link
            href="/login"
            className="text-primary-red font-semibold hover:text-red-600 cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
