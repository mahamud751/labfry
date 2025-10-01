import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { JWTService } from "../utils/jwt.service";
import { EmailService } from "../email/email.service";

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JWTService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
