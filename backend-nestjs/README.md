# 🚀 Labfry NestJS Backend

A professional, enterprise-grade backend API built with **NestJS**, **TypeScript**, **Prisma**, **MongoDB**, and **Swagger**.

## ✨ Features

### 🏗️ **Professional Architecture**
- ✅ **NestJS Framework** - Scalable, maintainable, and testable
- ✅ **TypeScript** - Full type safety and modern JavaScript features  
- ✅ **Modular Design** - Clean separation of concerns
- ✅ **Dependency Injection** - Loosely coupled, testable components
- ✅ **Decorators** - Clean, declarative code style

### 📚 **Comprehensive API Documentation**
- ✅ **Swagger/OpenAPI 3.0** - Interactive API documentation
- ✅ **Professional DTOs** - Detailed request/response specifications
- ✅ **Validation Examples** - Clear error handling documentation
- ✅ **Authentication Flow** - JWT and cookie auth examples
- ✅ **Rate Limiting Info** - Security guidelines and limits

### 🔐 **Advanced Authentication**
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-based Access Control** - Admin, User, Customer roles
- ✅ **Email Verification** - 6-digit codes with expiration
- ✅ **Password Reset** - Secure reset flow with codes
- ✅ **Session Management** - Refresh tokens and logout

### 🛡️ **Enterprise Security**
- ✅ **Rate Limiting** - Advanced throttling with multiple tiers
- ✅ **Input Validation** - Comprehensive DTO validation
- ✅ **Password Hashing** - Bcrypt with proper salting
- ✅ **CORS Protection** - Configurable cross-origin policies
- ✅ **Security Headers** - Production-ready security

### 📧 **Email Services**
- ✅ **Nodemailer Integration** - Professional email templates
- ✅ **SMTP Configuration** - Support for multiple providers
- ✅ **Email Verification** - Automated verification workflow
- ✅ **Password Reset** - Secure password reset via email
- ✅ **Welcome Emails** - User onboarding automation

### 🗄️ **Database & ORM**
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **MongoDB Support** - NoSQL document database
- ✅ **Schema Management** - Database migrations and seeding
- ✅ **Connection Pooling** - Optimized database connections

## 🚀 Quick Start

### 1. **Installation**
```bash
# Navigate to project directory
cd backend-nestjs

# Run setup script (recommended)
./setup.sh

# OR install manually
npm install
```

### 2. **Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

### 3. **Database Setup**
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 4. **Start Development Server**
```bash
npm run start:dev
```

### 5. **Access Documentation**
- **Swagger UI**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/health
- **API Base**: http://localhost:5000/api

## 📋 API Endpoints

### 🔐 **Authentication**
| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `POST` | `/api/auth/register` | Register new user | 2/5min |
| `POST` | `/api/auth/login` | User login | 3/1min |
| `POST` | `/api/auth/verify-email` | Email verification | 5/1min |
| `POST` | `/api/auth/forgot-password` | Request password reset | 2/5min |
| `POST` | `/api/auth/reset-password` | Reset password | 5/1min |
| `POST` | `/api/auth/refresh` | Refresh JWT tokens | - |
| `POST` | `/api/auth/logout` | User logout | - |

### 👤 **User Management**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/profile` | Get user profile | ✅ JWT |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ JWT |
| `PUT` | `/api/auth/online-status` | Update online status | ✅ JWT |
| `POST` | `/api/auth/resend-verification` | Resend verification code | - |

### 👑 **Admin Functions**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/admin/reset-password` | Admin password reset | ✅ Admin |

### 🏥 **System Health**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/auth/email-health` | Email service status |

## 🎯 **Professional DTOs**

### Registration DTO
```typescript
class RegisterDto {
  @ApiProperty({
    description: 'User email address - must be valid and unique',
    example: 'john.doe@labfry.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Secure password with complexity requirements',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  password: string;

  // ... more fields
}
```

### Login DTO
```typescript
class LoginDto {
  @ApiProperty({
    description: 'User email for authentication',
    example: 'john.doe@labfry.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    format: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Extended session duration',
    default: false,
  })
  @IsOptional()
  rememberMe?: boolean;
}
```

## 🛡️ **Rate Limiting Configuration**

```typescript
// Login attempts
@Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 attempts per minute

// Email services  
@Throttle({ medium: { limit: 2, ttl: 300000 } }) // 2 requests per 5 minutes

// General verification
@Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
```

### Rate Limit Tiers
- **Short (Auth)**: 3 requests per 1 minute - Login attempts
- **Medium (Email)**: 2 requests per 5 minutes - Email services
- **Long (General)**: 100 requests per 1 minute - General API calls

## 📊 **Swagger Documentation Features**

### Interactive API Explorer
- ✅ **Try It Out** - Test endpoints directly
- ✅ **Authentication** - JWT Bearer token support
- ✅ **Request Examples** - Multiple example scenarios
- ✅ **Response Examples** - Success and error responses
- ✅ **Schema Validation** - Real-time validation feedback

### Professional Presentation
- ✅ **Custom Styling** - Branded documentation theme
- ✅ **Organized Tags** - Logical endpoint grouping
- ✅ **Detailed Descriptions** - Comprehensive endpoint docs
- ✅ **Security Schemes** - JWT and Cookie authentication
- ✅ **Error Documentation** - Complete error response examples

## 🔧 **Development Scripts**

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Database  
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open Prisma Studio

# Testing
npm run test               # Unit tests
npm run test:watch         # Watch mode tests
npm run test:cov           # Coverage report
npm run test:e2e           # End-to-end tests

# Code Quality
npm run lint               # ESLint check
npm run format             # Prettier formatting
```

## 🌐 **Environment Configuration**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/labfry"

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_secure
JWT_REFRESH_SECRET=your_super_secret_refresh_key_make_it_long_and_secure

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@labfry.com
FROM_NAME=Labfry Technology

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## 🏗️ **Project Structure**

```
backend-nestjs/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── register.dto.ts # Registration validation
│   │   │   ├── auth.dto.ts     # Login, verify, reset DTOs
│   │   │   └── response.dto.ts # Response schemas
│   │   ├── guards/             # Authentication guards
│   │   ├── strategies/         # Passport strategies
│   │   ├── auth.controller.ts  # API endpoints
│   │   ├── auth.service.ts     # Business logic
│   │   └── auth.module.ts      # Module configuration
│   ├── user/                   # User management
│   ├── email/                  # Email services
│   ├── prisma/                 # Database module
│   ├── common/                 # Shared utilities
│   ├── health/                 # Health checks
│   ├── websocket/              # Real-time features
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application bootstrap
├── prisma/                     # Database schema
├── test/                       # Test files
├── dist/                       # Built application
└── docs/                       # Documentation
```

## 🚀 **Deployment**

### Development
```bash
npm run start:dev
```

### Production
```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist/
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
```

## 📈 **Performance & Monitoring**

### Built-in Features
- ✅ **Health Checks** - System and database status
- ✅ **Request Validation** - Input sanitization and validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Logging** - Structured application logging
- ✅ **Rate Limiting** - DDoS and abuse protection

### Monitoring Endpoints
- `/api/health` - Overall system health
- `/api/auth/email-health` - Email service status
- `/api/docs` - API documentation and testing

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

- **Documentation**: http://localhost:5000/api/docs
- **Email**: support@labfry.com
- **Website**: https://labfry.com

---

**Built with ❤️ by Labfry Technology**