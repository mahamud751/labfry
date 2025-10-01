import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { WebSocketModule } from "./websocket/websocket.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 3, // 3 requests per minute for login endpoint
      },
    ]),

    // Feature modules
    AuthModule,
    HealthModule,
    WebSocketModule,
  ],
})
export class AppModule {}
