import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
} from "../../types";

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Load initial state from localStorage
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");

  if (savedUser && savedToken) {
    try {
      initialState.user = JSON.parse(savedUser);
      initialState.token = savedToken;
      initialState.isAuthenticated = true;
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
}

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: any }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: any }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const verifyEmail = createAsyncThunk<
  AuthResponse,
  { token?: string; code?: string; email?: string },
  { rejectValue: any }
>("auth/verifyEmail", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      error.response?.data?.message || "Email verification failed"
    );
  }
});

export const forgotPassword = createAsyncThunk<
  AuthResponse,
  { email: string },
  { rejectValue: any }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      error.response?.data?.message || "Password reset request failed"
    );
  }
});

export const resetPassword = createAsyncThunk<
  AuthResponse,
  { token?: string; code?: string; email?: string; password: string },
  { rejectValue: any }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      error.response?.data?.message || "Password reset failed"
    );
  }
});

export const resendVerificationCode = createAsyncThunk<
  AuthResponse,
  { email: string },
  { rejectValue: any }
>("auth/resendVerification", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  } catch (error: any) {
    // Return the full error object for rate limit handling
    if (error.response?.status === 429) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      error.response?.data?.message || "Failed to resend verification code"
    );
  }
});

export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/profile");
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateProfile = createAsyncThunk<
  AuthResponse,
  UpdateProfileData,
  { rejectValue: string }
>("auth/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Profile update failed"
    );
  }
});

export const updateOnlineStatus = createAsyncThunk<
  void,
  { isOnline: boolean },
  { rejectValue: string }
>("auth/updateOnlineStatus", async ({ isOnline }, { rejectWithValue }) => {
  try {
    await api.put("/auth/online-status", { isOnline });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Status update failed"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.payload.success &&
          action.payload.user &&
          action.payload.token
        ) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken || null;
          state.isAuthenticated = true;

          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Registration doesn't automatically log in the user
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      });

    // Email verification
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          if (state.user) {
            state.user = { ...state.user, ...action.payload.user };

            // Update localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(state.user));
            }
          }
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Email verification failed";
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Password reset request failed";
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Password reset failed";
      });

    // Get profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch profile";
        // If profile fetch fails, user might be unauthorized
        if (
          action.payload?.includes("unauthorized") ||
          action.payload?.includes("token")
        ) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;

          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;

          // Update localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Profile update failed";
      });

    // Update online status
    builder
      .addCase(updateOnlineStatus.pending, (state) => {
        // Don't show loading for status updates
      })
      .addCase(updateOnlineStatus.fulfilled, (state) => {
        // Status updated successfully
      })
      .addCase(updateOnlineStatus.rejected, (state, action) => {
        // Silently handle status update errors
        console.error("Online status update failed:", action.payload);
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        // Force logout even if API call fails
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      });
  },
});

export const { clearError, setCredentials, clearCredentials, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
