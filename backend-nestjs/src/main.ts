import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { ThrottlerExceptionFilter } from "./filters/throttler-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global exception filters
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Enable CORS
  const frontendUrls = [
    process.env.FRONTEND_URL || "http://localhost:3001",
    process.env.FRONTEND_URL_NGINX || "http://localhost:3000",
    process.env.FRONTEND_URL_PRODUCTION || "https://labfry.pino7.com",
    process.env.FRONTEND_URL_SERVER || "http://93.127.199.59:3001",
    process.env.FRONTEND_URL_SERVER_NGINX || "http://93.127.199.59:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://93.127.199.59:3000",
    "http://93.127.199.59:3001",
    "https://labfry.pino7.com",
    "https://www.labfry.pino7.com"
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      console.log('🌐 CORS Origin Request:', origin);
      
      // Check if origin is in allowed list
      if (frontendUrls.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Allow all localhost origins for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      
      // Allow all pino7.com subdomains
      if (origin.includes('.pino7.com')) {
        return callback(null, true);
      }
      
      // Allow specific production domains
      if (origin === 'https://labfry.pino7.com' || origin === 'https://www.labfry.pino7.com') {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "Cookie", 
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    preflightContinue: false
  });

  // Cookie parser
  app.use(cookieParser());

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Labfry API")
    .setDescription(
      `
      🚀 **Labfry Backend API** - A comprehensive authentication and user management system
      
      ## Features
      - 🔐 **JWT Authentication** with refresh tokens
      - 📧 **Email Verification** with 6-digit codes  
      - 🔒 **Password Reset** with secure codes
      - 👥 **Role-based Access Control** (Admin, User, Customer)
      - ⚡ **Real-time Communication** with WebSocket
      - 🛡️ **Rate Limiting** and security features
      - 📝 **Comprehensive API Documentation**
      
      ## Authentication Flow
      1. **Register** → Email verification required
      2. **Login** → JWT tokens with session management
      3. **Access Protected Routes** → Bearer token authentication
      4. **Password Reset** → Email-based secure reset flow
      
      ## Rate Limiting
      - **Login**: 3 attempts per minute
      - **Registration**: 2 attempts per 5 minutes  
      - **Email Services**: 2 requests per 5 minutes
      - **Password Reset**: 5 attempts per minute
      
      ## Security Features
      - Bcrypt password hashing
      - JWT token expiration
      - Rate limiting protection
      - Input validation and sanitization
      - Role-based authorization
    `
    )
    .setVersion("1.0.0")
    .setContact("Labfry Technology", "https://labfry.com", "support@labfry.com")
    .setLicense("MIT", "https://opensource.org/licenses/MIT")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .addCookieAuth("refreshToken", {
      type: "apiKey",
      in: "cookie",
      name: "refreshToken",
      description: "Refresh token stored in HTTP-only cookie",
    })
    .addTag("Authentication", "User registration, login, and authentication")
    .addTag("User Management", "User profile and account management")
    .addTag("Email Services", "Email verification and password reset")
    .addTag("Admin", "Administrative functions and user management")
    .addTag("Health", "System health and monitoring endpoints")
    .addServer("http://localhost:5000", "Development server")
    .addServer("https://api.labfry.com", "Production server")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      docExpansion: "none",
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: "Labfry API Documentation",
    customfavIcon: "/favicon.ico",
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #EE3638; }
    `,
  });

  const port = configService.get("PORT") || 5000;
  await app.listen(port);

  console.log("🚀 Labfry NestJS Backend Started");
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log(`🔍 Health Check: http://localhost:${port}/api/health`);
}

bootstrap();
