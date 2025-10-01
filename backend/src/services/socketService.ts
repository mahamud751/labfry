import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { JWTUtil } from "../utils/jwt";
import AuthService from "../services/authService";
import { config } from "../config";
import { SocketUser, OnlineStatusUpdate } from "../types";

export class SocketService {
  private io: SocketServer;
  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: config.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      console.log(`🔌 New socket connection: ${socket.id}`);

      // Handle authentication
      socket.on("authenticate", async (data: { token: string }) => {
        try {
          const payload = JWTUtil.verifyToken(data.token);
          const user = await AuthService.getUserProfile(payload.userId);

          if (!user) {
            socket.emit("auth_error", { message: "User not found" });
            socket.disconnect();
            return;
          }

          // Store user in connected users map
          const socketUser: SocketUser = {
            userId: user.id,
            socketId: socket.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            joinedAt: new Date(),
          };

          this.connectedUsers.set(socket.id, socketUser);

          // Update user online status in database
          await AuthService.updateOnlineStatus(user.id, true);

          // Join user to their own room for targeted messages
          socket.join(user.id);

          // Notify other users that this user is online
          const onlineUpdate: OnlineStatusUpdate = {
            userId: user.id,
            isOnline: true,
            firstName: user.firstName,
            lastName: user.lastName,
          };

          socket.broadcast.emit("user_online", onlineUpdate);

          // Send authentication success
          socket.emit("authenticated", {
            success: true,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              isOnline: true,
            },
          });

          console.log(
            `✅ User authenticated: ${user.firstName} ${user.lastName} (${user.id})`
          );
        } catch (error) {
          console.error("Socket authentication error:", error);
          socket.emit("auth_error", { message: "Invalid token" });
          socket.disconnect();
        }
      });

      // Handle manual online/offline status updates
      socket.on("update_online_status", async (data: { isOnline: boolean }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        try {
          // Update status in database
          await AuthService.updateOnlineStatus(user.userId, data.isOnline);

          // Broadcast status change to all other users
          const statusUpdate: OnlineStatusUpdate = {
            userId: user.userId,
            isOnline: data.isOnline,
            firstName: user.firstName,
            lastName: user.lastName,
          };

          socket.broadcast.emit("user_status_changed", statusUpdate);

          // Send confirmation back to the user
          socket.emit("status_updated", {
            success: true,
            isOnline: data.isOnline,
            message: data.isOnline
              ? "You are now online"
              : "You are now offline",
          });

          console.log(
            `📡 Status updated: ${user.firstName} ${user.lastName} is now ${
              data.isOnline ? "online" : "offline"
            }`
          );
        } catch (error) {
          console.error("Error updating online status:", error);
          socket.emit("error", { message: "Failed to update status" });
        }
      });

      // Handle getting online users list
      socket.on("get_online_users", () => {
        const onlineUsers = Array.from(this.connectedUsers.values()).map(
          (user) => ({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            joinedAt: user.joinedAt,
          })
        );

        socket.emit("online_users_list", { users: onlineUsers });
      });

      // Handle user typing events (for potential chat features)
      socket.on("typing_start", (data: { targetUserId?: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const typingData = {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        if (data.targetUserId) {
          // Send to specific user
          socket.to(data.targetUserId).emit("user_typing_start", typingData);
        } else {
          // Broadcast to all users
          socket.broadcast.emit("user_typing_start", typingData);
        }
      });

      socket.on("typing_stop", (data: { targetUserId?: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const typingData = {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        if (data.targetUserId) {
          // Send to specific user
          socket.to(data.targetUserId).emit("user_typing_stop", typingData);
        } else {
          // Broadcast to all users
          socket.broadcast.emit("user_typing_stop", typingData);
        }
      });

      // Handle disconnect
      socket.on("disconnect", async () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          try {
            // Update user offline status in database
            await AuthService.updateOnlineStatus(user.userId, false);

            // Notify other users that this user is offline
            const offlineUpdate: OnlineStatusUpdate = {
              userId: user.userId,
              isOnline: false,
              firstName: user.firstName,
              lastName: user.lastName,
            };

            socket.broadcast.emit("user_offline", offlineUpdate);

            // Remove user from connected users map
            this.connectedUsers.delete(socket.id);

            console.log(
              `🔌 User disconnected: ${user.firstName} ${user.lastName} (${user.userId})`
            );
          } catch (error) {
            console.error("Error handling disconnect:", error);
          }
        }

        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });

      // Handle connection errors
      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }

  // Method to send message to specific user
  public sendToUser(userId: string, event: string, data: any): void {
    this.io.to(userId).emit(event, data);
  }

  // Method to broadcast to all users
  public broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Method to get online users count
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Method to get all online users
  public getOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  // Method to check if user is online
  public isUserOnline(userId: string): boolean {
    return Array.from(this.connectedUsers.values()).some(
      (user) => user.userId === userId
    );
  }

  // Method to disconnect specific user
  public disconnectUser(userId: string): void {
    const userSocket = Array.from(this.connectedUsers.entries()).find(
      ([_, user]) => user.userId === userId
    );

    if (userSocket) {
      const [socketId] = userSocket;
      this.io.sockets.sockets.get(socketId)?.disconnect();
    }
  }

  // Get Socket.IO instance for additional functionality
  public getIO(): SocketServer {
    return this.io;
  }
}

export default SocketService;
