"use client";

import { useAppSelector } from "../store/hooks";
import { User } from "../types";

interface RoleGuardProps {
  allowedRoles: ("ADMIN" | "USER" | "CUSTOMER")[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBadgeProps {
  role: User["role"];
  className?: string;
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const roleConfig = {
    ADMIN: {
      label: "Administrator",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "👑",
    },
    USER: {
      label: "User",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "👤",
    },
    CUSTOMER: {
      label: "Customer",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "🛍️",
    },
  };

  const config = roleConfig[role];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.color} ${className}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

interface PermissionCheckProps {
  permission: "read" | "write" | "delete" | "admin";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionCheck({
  permission,
  children,
  fallback = null,
}: PermissionCheckProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <>{fallback}</>;
  }

  // Define role-based permissions
  const rolePermissions: Record<User["role"], string[]> = {
    ADMIN: ["read", "write", "delete", "admin"],
    USER: ["read", "write"],
    CUSTOMER: ["read"],
  };

  const userPermissions = rolePermissions[user.role] || [];

  if (!userPermissions.includes(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for role-based logic
export function useRole() {
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const isCustomer = user?.role === "CUSTOMER";

  const hasPermission = (permission: "read" | "write" | "delete" | "admin") => {
    if (!user) return false;

    const rolePermissions: Record<User["role"], string[]> = {
      ADMIN: ["read", "write", "delete", "admin"],
      USER: ["read", "write"],
      CUSTOMER: ["read"],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const canAccess = (allowedRoles: ("ADMIN" | "USER" | "CUSTOMER")[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    isAdmin,
    isUser,
    isCustomer,
    hasPermission,
    canAccess,
    role: user?.role,
  };
}
