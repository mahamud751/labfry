import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Injectable, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Server, Socket } from "socket.io";
import { JWTService } from "../utils/jwt.service";
import { AuthService } from "../auth/auth.service";
import { SocketUser, OnlineStatusUpdate } from "../types";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(
    private readonly jwtService: JWTService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`🔌 New socket connection: ${client.id}`);

    // Set a timeout for authentication - disconnect unauthenticated clients after 30 seconds
    setTimeout(() => {
      const user = this.connectedUsers.get(client.id);
      if (!user && client.connected) {
        console.log(`⏰ Disconnecting unauthenticated client: ${client.id}`);
        client.emit("auth_timeout", {
          message:
            "Authentication timeout - please authenticate within 30 seconds",
        });
        client.disconnect();
      }
    }, 30000);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      try {
        // Update user offline status in database
        await this.authService.updateOnlineStatus(user.userId, false);

        // Notify other users that this user is offline
        const offlineUpdate: OnlineStatusUpdate = {
          userId: user.userId,
          isOnline: false,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        client.broadcast.emit("user_offline", offlineUpdate);

        // Remove user from connected users map
        this.connectedUsers.delete(client.id);

        console.log(
          `🔌 User disconnected: ${user.firstName} ${user.lastName} (${user.userId})`
        );
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    }

    console.log(`🔌 Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage("authenticate")
  async handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token: string }
  ) {
    try {
      // Validate input data
      if (!data || !data.token) {
        client.emit("auth_error", { message: "Token is required" });
        return;
      }

      const payload = this.jwtService.verifyToken(data.token);
      const user = await this.authService.getUserProfile(payload.userId);

      if (!user) {
        client.emit("auth_error", { message: "User not found" });
        return;
      }

      // Store user in connected users map
      const socketUser: SocketUser = {
        userId: user.id,
        socketId: client.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        joinedAt: new Date(),
      };

      this.connectedUsers.set(client.id, socketUser);

      // Update user online status in database
      await this.authService.updateOnlineStatus(user.id, true);

      // Join user to their own room for targeted messages
      client.join(user.id);

      // Notify other users that this user is online
      const onlineUpdate: OnlineStatusUpdate = {
        userId: user.id,
        isOnline: true,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      client.broadcast.emit("user_online", onlineUpdate);

      // Send authentication success
      client.emit("authenticated", {
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
      console.error("Socket authentication error:", error.message);
      client.emit("auth_error", { message: "Authentication failed" });
      // Don't disconnect immediately, let client handle the error
    }
  }

  @SubscribeMessage("update_online_status")
  async handleUpdateOnlineStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { isOnline: boolean }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit("auth_error", { message: "Please authenticate first" });
      return;
    }

    try {
      // Update status in database
      await this.authService.updateOnlineStatus(user.userId, data.isOnline);

      // Broadcast status change to all other users
      const statusUpdate: OnlineStatusUpdate = {
        userId: user.userId,
        isOnline: data.isOnline,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      client.broadcast.emit("user_status_changed", statusUpdate);

      // Send confirmation back to the user
      client.emit("status_updated", {
        success: true,
        isOnline: data.isOnline,
        message: data.isOnline ? "You are now online" : "You are now offline",
      });

      console.log(
        `📡 Status updated: ${user.firstName} ${user.lastName} is now ${
          data.isOnline ? "online" : "offline"
        }`
      );
    } catch (error) {
      console.error("Error updating online status:", error);
      client.emit("error", { message: "Failed to update status" });
    }
  }

  @SubscribeMessage("get_online_users")
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit("auth_error", { message: "Please authenticate first" });
      return;
    }

    const onlineUsers = Array.from(this.connectedUsers.values()).map(
      (user) => ({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        joinedAt: user.joinedAt,
      })
    );

    client.emit("online_users_list", { users: onlineUsers });
  }

  @SubscribeMessage("typing_start")
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetUserId?: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit("auth_error", { message: "Please authenticate first" });
      return;
    }

    const typingData = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    if (data.targetUserId) {
      // Send to specific user
      client.to(data.targetUserId).emit("user_typing_start", typingData);
    } else {
      // Broadcast to all users
      client.broadcast.emit("user_typing_start", typingData);
    }
  }

  @SubscribeMessage("typing_stop")
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetUserId?: string }
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit("auth_error", { message: "Please authenticate first" });
      return;
    }

    const typingData = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    if (data.targetUserId) {
      // Send to specific user
      client.to(data.targetUserId).emit("user_typing_stop", typingData);
    } else {
      // Broadcast to all users
      client.broadcast.emit("user_typing_stop", typingData);
    }
  }

  // Method to send message to specific user
  public sendToUser(userId: string, event: string, data: any): void {
    this.server.to(userId).emit(event, data);
  }

  // Method to broadcast to all users
  public broadcast(event: string, data: any): void {
    this.server.emit(event, data);
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
      this.server.sockets.sockets.get(socketId)?.disconnect();
    }
  }
}
