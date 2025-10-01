import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { AuthModule } from "../auth/auth.module";
import { JWTService } from "../utils/jwt.service";

@Module({
  imports: [AuthModule],
  providers: [SocketGateway, JWTService],
  exports: [SocketGateway],
})
export class WebSocketModule {}
