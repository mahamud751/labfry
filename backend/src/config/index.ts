import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  JWT_EXPIRE_TIME: "15m",
  JWT_REFRESH_EXPIRE_TIME: "7d",

  // Email
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  FROM_NAME: process.env.FROM_NAME || "Labfry Technology",

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Secrets
  EMAIL_VERIFICATION_SECRET: process.env.EMAIL_VERIFICATION_SECRET || "",
  PASSWORD_RESET_SECRET: process.env.PASSWORD_RESET_SECRET || "",

  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // 100 requests per window

  // Session
  SESSION_EXPIRE_TIME: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_SESSION_EXPIRE_TIME: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "EMAIL_VERIFICATION_SECRET",
  "PASSWORD_RESET_SECRET",
];

if (config.NODE_ENV === "production") {
  requiredEnvVars.push("SMTP_HOST", "SMTP_USER", "SMTP_PASS", "FROM_EMAIL");
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
