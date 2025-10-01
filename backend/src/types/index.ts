export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER" | "CUSTOMER";
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DELETED";
  isOnline: boolean;
  lastSeen?: Date | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "ADMIN" | "USER" | "CUSTOMER";
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  firstName: string;
  lastName: string;
  role: string;
  joinedAt: Date;
}

export interface OnlineStatusUpdate {
  userId: string;
  isOnline: boolean;
  firstName: string;
  lastName: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
