import { io, Socket } from "socket.io-client";
import { store } from "../store";
import {
  setConnectionStatus,
  setAuthenticated,
  setOnlineUsers,
  updateUserStatus,
  setError,
} from "../store/slices/socketSlice";
import { updateUser } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import { OnlineStatusUpdate, SocketUser } from "../types";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isAuthenticated = false;

  connect(): void {
    if (this.socket?.connected) {
      console.log("🔌 Socket already connected:", this.socket.id);
      return;
    }

    // Disconnect existing socket if it exists but not connected
    if (this.socket && !this.socket.connected) {
      console.log("🔌 Cleaning up existing disconnected socket");
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    store.dispatch(setConnectionStatus("connecting"));

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("🔌 Socket connected:", this.socket?.id);
      store.dispatch(setConnectionStatus("connected"));
      this.reconnectAttempts = 0;

      // Auto-authenticate if user is logged in
      const state = store.getState();
      if (state.auth.isAuthenticated && state.auth.token) {
        this.authenticate(state.auth.token);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      store.dispatch(setConnectionStatus("disconnected"));
      store.dispatch(setAuthenticated(false));
      this.isAuthenticated = false;

      // Attempt to reconnect if it wasn't a manual disconnect
      if (
        reason !== "io client disconnect" &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.connect();
        }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error);
      store.dispatch(setConnectionStatus("error"));
      store.dispatch(setError(error.message));
    });

    // Authentication events
    this.socket.on("authenticated", (data: { success: boolean; user: any }) => {
      console.log("✅ Socket authenticated:", data);
      if (data.success) {
        store.dispatch(setAuthenticated(true));
        this.isAuthenticated = true;
        toast.success("Connected to real-time updates");

        // Request online users list
        this.getOnlineUsers();
      }
    });

    this.socket.on("auth_error", (data: { message: string }) => {
      console.error("❌ Socket authentication error:", data);
      store.dispatch(setAuthenticated(false));
      store.dispatch(setError(data.message));
      this.isAuthenticated = false;
      toast.error("Authentication failed: " + data.message);
    });

    // User presence events
    this.socket.on("user_online", (data: OnlineStatusUpdate) => {
      console.log("👤 User came online:", data);
      store.dispatch(updateUserStatus(data));
      toast.success(`${data.firstName} ${data.lastName} is now online`, {
        duration: 2000,
        icon: "🟢",
      });
    });

    this.socket.on("user_offline", (data: OnlineStatusUpdate) => {
      console.log("👤 User went offline:", data);
      store.dispatch(updateUserStatus(data));
      toast(`${data.firstName} ${data.lastName} is now offline`, {
        duration: 2000,
        icon: "🔴",
      });
    });

    this.socket.on("user_status_changed", (data: OnlineStatusUpdate) => {
      console.log("👤 User status changed:", data);
      store.dispatch(updateUserStatus(data));

      const statusText = data.isOnline ? "online" : "offline";
      const icon = data.isOnline ? "🟢" : "🔴";
      toast(`${data.firstName} ${data.lastName} is now ${statusText}`, {
        duration: 2000,
        icon,
      });
    });

    this.socket.on("online_users_list", (data: { users: SocketUser[] }) => {
      console.log("👥 Online users:", data.users);
      store.dispatch(setOnlineUsers(data.users));
    });

    this.socket.on(
      "status_updated",
      (data: { success: boolean; isOnline: boolean; message: string }) => {
        console.log("📡 Status update confirmed:", data);
        if (data.success) {
          // Update current user's online status
          const state = store.getState();
          if (state.auth.user) {
            store.dispatch(updateUser({ isOnline: data.isOnline }));
          }
          toast.success(data.message, {
            icon: data.isOnline ? "🟢" : "🔴",
          });
        }
      }
    );

    // Error events
    this.socket.on("error", (data: { message: string }) => {
      console.error("🚨 Socket error:", data);
      store.dispatch(setError(data.message));
      toast.error(data.message);
    });

    // Typing events (for potential chat features)
    this.socket.on(
      "user_typing_start",
      (data: { userId: string; firstName: string; lastName: string }) => {
        console.log("⌨️ User started typing:", data);
        // Handle typing indicator
      }
    );

    this.socket.on(
      "user_typing_stop",
      (data: { userId: string; firstName: string; lastName: string }) => {
        console.log("⌨️ User stopped typing:", data);
        // Handle typing indicator
      }
    );
  }

  authenticate(token: string): void {
    if (!this.socket?.connected) {
      console.warn("Socket not connected, cannot authenticate");
      return;
    }

    console.log("🔐 Authenticating socket...");
    this.socket.emit("authenticate", { token });
  }

  updateOnlineStatus(isOnline: boolean): void {
    if (!this.socket?.connected || !this.isAuthenticated) {
      console.warn(
        "Socket not connected or authenticated, cannot update status"
      );
      return;
    }

    console.log("📡 Updating online status:", isOnline);
    this.socket.emit("update_online_status", { isOnline });
  }

  getOnlineUsers(): void {
    if (!this.socket?.connected || !this.isAuthenticated) {
      console.warn(
        "Socket not connected or authenticated, cannot get online users"
      );
      return;
    }

    console.log("👥 Requesting online users list...");
    this.socket.emit("get_online_users");
  }

  startTyping(targetUserId?: string): void {
    if (!this.socket?.connected || !this.isAuthenticated) {
      return;
    }

    this.socket.emit("typing_start", { targetUserId });
  }

  stopTyping(targetUserId?: string): void {
    if (!this.socket?.connected || !this.isAuthenticated) {
      return;
    }

    this.socket.emit("typing_stop", { targetUserId });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Manually disconnecting socket...");
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isAuthenticated = false;
      store.dispatch(setConnectionStatus("disconnected"));
      store.dispatch(setAuthenticated(false));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionStatus(): string {
    if (!this.socket) return "disconnected";
    if (this.socket.connected && this.isAuthenticated) return "authenticated";
    if (this.socket.connected) return "connected";
    return "disconnected";
  }

  // Send custom events
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn("Socket not connected, cannot emit event:", event);
      return;
    }

    this.socket.emit(event, data);
  }

  // Listen to custom events
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn("Socket not initialized, cannot listen to event:", event);
      return;
    }

    this.socket.on(event, callback);
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
