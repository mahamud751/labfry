import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config";
import Database from "./utils/database";
import { SocketService } from "./services/socketService";
import { generalRateLimit } from "./middleware/rateLimit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const socketService = new SocketService(server);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Rate limiting
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbHealth = await Database.healthCheck();
  const onlineUsers = socketService.getOnlineUsersCount();

  res.status(dbHealth ? 200 : 503).json({
    success: dbHealth,
    message: dbHealth ? "Server is healthy" : "Database connection failed",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    onlineUsers,
    environment: config.NODE_ENV,
  });
});

// API info endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Labfry Backend API",
    version: "1.0.0",
    description: "Full-stack authentication system with real-time features",
    endpoints: {
      auth: "/api/auth",
      health: "/health",
    },
    docs: "https://github.com/labfry-technology/backend",
    status: "active",
  });
});

// API routes
app.use("/api/auth", authRoutes);

// Socket.IO endpoint info
app.get("/api/socket/info", (req, res) => {
  res.json({
    connected: socketService.getOnlineUsersCount(),
    onlineUsers: socketService.getOnlineUsers().map((user) => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      joinedAt: user.joinedAt,
    })),
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("🔌 HTTP server closed.");

    try {
      await Database.disconnect();
      console.log("💾 Database disconnected.");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after 10 seconds");
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
async function startServer() {
  try {
    // Connect to database
    await Database.connect();

    // Start HTTP server
    server.listen(config.PORT, () => {
      console.log("🚀 Server Status:");
      console.log(`   ├── Environment: ${config.NODE_ENV}`);
      console.log(`   ├── Port: ${config.PORT}`);
      console.log(`   ├── Frontend URL: ${config.FRONTEND_URL}`);
      console.log(`   ├── API Base: http://localhost:${config.PORT}/api`);
      console.log(
        `   ├── Health Check: http://localhost:${config.PORT}/health`
      );
      console.log(`   └── Socket.IO: ✅ Ready for connections`);
      console.log("");
      console.log("📡 Socket.IO Events:");
      console.log("   ├── authenticate - User authentication");
      console.log("   ├── update_online_status - Manual status updates");
      console.log("   ├── get_online_users - Get online users list");
      console.log("   ├── user_online - User came online");
      console.log("   ├── user_offline - User went offline");
      console.log("   └── user_status_changed - Status update broadcast");
      console.log("");
      console.log("✅ Server ready and waiting for connections...");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

// Start the server
startServer();

// Export for testing
export { app, server, socketService };
