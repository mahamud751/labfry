import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV", "development");
  }

  get port(): number {
    return this.configService.get<number>("PORT", 5000);
  }

  get databaseUrl(): string {
    return this.configService.get<string>("DATABASE_URL", "");
  }

  get jwtSecret(): string {
    return this.configService.get<string>("JWT_SECRET", "");
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>("JWT_REFRESH_SECRET", "");
  }

  get jwtExpireTime(): string {
    return "15m";
  }

  get jwtRefreshExpireTime(): string {
    return "7d";
  }

  get smtpHost(): string {
    return this.configService.get<string>("SMTP_HOST", "");
  }

  get smtpPort(): number {
    return this.configService.get<number>("SMTP_PORT", 587);
  }

  get smtpUser(): string {
    return this.configService.get<string>("SMTP_USER", "");
  }

  get smtpPass(): string {
    return this.configService.get<string>("SMTP_PASS", "");
  }

  get fromEmail(): string {
    return this.configService.get<string>("FROM_EMAIL", "");
  }

  get fromName(): string {
    return this.configService.get<string>("FROM_NAME", "Labfry Technology");
  }

  get frontendUrl(): string {
    return this.configService.get<string>(
      "FRONTEND_URL",
      "http://localhost:3001"
    );
  }

  get emailVerificationSecret(): string {
    return this.configService.get<string>("EMAIL_VERIFICATION_SECRET", "");
  }

  get passwordResetSecret(): string {
    return this.configService.get<string>("PASSWORD_RESET_SECRET", "");
  }

  get rateLimitWindow(): number {
    return 15 * 60 * 1000; // 15 minutes
  }

  get rateLimitMax(): number {
    return 100; // 100 requests per window
  }

  get sessionExpireTime(): number {
    return 24 * 60 * 60 * 1000; // 24 hours
  }

  get refreshSessionExpireTime(): number {
    return 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  // Validation helper
  validateRequiredEnvVars(): void {
    const requiredEnvVars = [
      "DATABASE_URL",
      "JWT_SECRET",
      "JWT_REFRESH_SECRET",
      "EMAIL_VERIFICATION_SECRET",
      "PASSWORD_RESET_SECRET",
    ];

    if (this.nodeEnv === "production") {
      requiredEnvVars.push("SMTP_HOST", "SMTP_USER", "SMTP_PASS", "FROM_EMAIL");
    }

    for (const envVar of requiredEnvVars) {
      if (!this.configService.get(envVar)) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  }
}
