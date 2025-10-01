import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketUser, OnlineStatusUpdate } from "../../types";

interface SocketState {
  isConnected: boolean;
  isAuthenticated: boolean;
  onlineUsers: SocketUser[];
  error: string | null;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
}

const initialState: SocketState = {
  isConnected: false,
  isAuthenticated: false,
  onlineUsers: [],
  error: null,
  connectionStatus: "disconnected",
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnectionStatus: (
      state,
      action: PayloadAction<SocketState["connectionStatus"]>
    ) => {
      state.connectionStatus = action.payload;
      state.isConnected = action.payload === "connected";
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<SocketUser[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<SocketUser>) => {
      const exists = state.onlineUsers.find(
        (user) => user.userId === action.payload.userId
      );
      if (!exists) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (user) => user.userId !== action.payload
      );
    },
    updateUserStatus: (state, action: PayloadAction<OnlineStatusUpdate>) => {
      const { userId, isOnline, firstName, lastName } = action.payload;

      if (isOnline) {
        // Add user if they're coming online
        const exists = state.onlineUsers.find((user) => user.userId === userId);
        if (!exists) {
          state.onlineUsers.push({
            userId,
            firstName,
            lastName,
            role: "USER", // Default role, will be updated if needed
            joinedAt: new Date().toISOString(),
          });
        }
      } else {
        // Remove user if they're going offline
        state.onlineUsers = state.onlineUsers.filter(
          (user) => user.userId !== userId
        );
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
});

export const {
  setConnectionStatus,
  setAuthenticated,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  updateUserStatus,
  setError,
  clearError,
  reset,
} = socketSlice.actions;

export default socketSlice.reducer;
