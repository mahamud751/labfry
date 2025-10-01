export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER" | "CUSTOMER";
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DELETED";
  isOnline: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "ADMIN" | "USER" | "CUSTOMER";
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  details?: any;
}

export interface SocketUser {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  joinedAt: string;
}

export interface OnlineStatusUpdate {
  userId: string;
  isOnline: boolean;
  firstName: string;
  lastName: string;
}
