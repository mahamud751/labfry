// app/profile/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import {
  getUserProfile,
  updateProfile,
  logoutUser,
  clearError,
} from "../../src/store/slices/authSlice";
import { updateOnlineStatus } from "../../src/store/slices/authSlice";
import socketService from "../../src/services/socketService";
import Button from "../components/Button";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const { isConnected, onlineUsers } = useAppSelector((state) => state.socket);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [isOnline, setIsOnline] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch user profile on mount
    dispatch(getUserProfile());
  }, [isAuthenticated, router, dispatch]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
      setIsOnline(user.isOnline);
    }
  }, [user]);

  // Clear errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await dispatch(
        updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        })
      ).unwrap();

      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error: any) {
      // Error is already handled by the slice
    }
  };

  const handleOnlineToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    // Update via Socket.IO for real-time updates
    if (socketService.isConnected()) {
      socketService.updateOnlineStatus(newStatus);
    }

    // Also update via API
    try {
      await dispatch(updateOnlineStatus({ isOnline: newStatus })).unwrap();
    } catch (error) {
      // Revert on error
      setIsOnline(!newStatus);
      toast.error("Failed to update online status");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      socketService.disconnect();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      // Force logout even if API fails
      socketService.disconnect();
      router.push("/login");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-white px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-primary-gray">Loading profile...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-2xl mx-auto">
        {/* Header with Status and Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-black leading-tight">
            Personal Information
          </h1>
          <div className="flex items-center gap-4">
            {/* Online Status Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-primary-gray">Status:</span>
              <button
                type="button"
                onClick={handleOnlineToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isOnline ? "bg-green-500" : "bg-gray-300"
                }`}
                disabled={!isConnected}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isOnline ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  isOnline ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="px-4 py-2 text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-primary-gray">
                Real-time connection:{" "}
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <span className="text-xs text-primary-gray">
              {onlineUsers.length} users online
            </span>
          </div>
        </div>

        {/* Email Verification Status */}
        {user && !user.emailVerified && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-yellow-800">
                Your email address is not verified. Please check your email for
                verification instructions.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-primary-black mb-4 leading-6 font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                placeholder="John"
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b-2 border-border-light focus:outline-none focus:border-primary-red bg-transparent text-primary-gray transition-colors"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-primary-black mb-4 leading-6 font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                placeholder="Doe"
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b-2 border-border-light focus:outline-none focus:border-primary-red bg-transparent text-primary-gray transition-colors"
              />
            </div>
          </div>

          {/* Email and Role Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-primary-black mb-4 leading-6 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="hello@gmail.com"
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b-2 border-border-light focus:outline-none focus:border-primary-red bg-transparent text-primary-gray transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-primary-black mb-4 leading-6 font-medium"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                placeholder="USER"
                onChange={handleChange}
                disabled
                className="w-full px-0 py-3 border-0 border-b-2 border-border-light focus:outline-none bg-transparent text-primary-gray/50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4 justify-center">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="primary"
                className="max-w-xs py-3.5 rounded-lg"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  variant="primary"
                  className="max-w-xs py-3.5 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data
                    if (user) {
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                      });
                    }
                  }}
                  variant="outline"
                  className="max-w-xs py-3.5 rounded-lg"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
