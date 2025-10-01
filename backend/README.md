# Labfry Backend

Full-stack backend application built with Express.js, TypeScript, Prisma, MongoDB, Socket.IO, and Nodemailer.

## Features

- 🔐 **Authentication System**: JWT-based authentication with refresh tokens
- 📧 **Email Services**: Email verification, password reset, welcome emails
- 🗄️ **Database**: MongoDB with Prisma ORM
- 🔄 **Real-time Communication**: Socket.IO for user presence and live updates
- 🛡️ **Security**: Rate limiting, CORS, Helmet, input validation
- 👥 **Role-based Access**: Admin, User, Customer roles
- ⚡ **TypeScript**: Fully typed for better development experience

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Gmail account for email services (or other SMTP provider)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file**

   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/labfry?retryWrites=true&w=majority"
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
   # ... other variables
   ```

4. **Set up the database**

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register`            | Register new user         | ❌            |
| POST   | `/api/auth/login`               | User login                | ❌            |
| POST   | `/api/auth/verify-email`        | Verify email address      | ❌            |
| POST   | `/api/auth/forgot-password`     | Request password reset    | ❌            |
| POST   | `/api/auth/reset-password`      | Reset password            | ❌            |
| POST   | `/api/auth/refresh`             | Refresh access token      | ❌            |
| POST   | `/api/auth/logout`              | User logout               | ✅            |
| GET    | `/api/auth/profile`             | Get user profile          | ✅            |
| PUT    | `/api/auth/profile`             | Update user profile       | ✅            |
| PUT    | `/api/auth/online-status`       | Update online status      | ✅            |
| POST   | `/api/auth/resend-verification` | Resend verification email | ✅            |

### System

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/health`          | Health check         |
| GET    | `/`                | API information      |
| GET    | `/api/socket/info` | Socket.IO statistics |

## Socket.IO Events

### Client to Server

| Event                  | Description                       | Data                        |
| ---------------------- | --------------------------------- | --------------------------- |
| `authenticate`         | Authenticate socket connection    | `{ token: string }`         |
| `update_online_status` | Update user online/offline status | `{ isOnline: boolean }`     |
| `get_online_users`     | Get list of online users          | `{}`                        |
| `typing_start`         | User started typing               | `{ targetUserId?: string }` |
| `typing_stop`          | User stopped typing               | `{ targetUserId?: string }` |

### Server to Client

| Event                 | Description                | Data                                               |
| --------------------- | -------------------------- | -------------------------------------------------- |
| `authenticated`       | Authentication successful  | `{ success: boolean, user: User }`                 |
| `auth_error`          | Authentication failed      | `{ message: string }`                              |
| `user_online`         | User came online           | `{ userId, isOnline: true, firstName, lastName }`  |
| `user_offline`        | User went offline          | `{ userId, isOnline: false, firstName, lastName }` |
| `user_status_changed` | User status updated        | `{ userId, isOnline, firstName, lastName }`        |
| `status_updated`      | Status update confirmation | `{ success: boolean, isOnline, message }`          |
| `online_users_list`   | List of online users       | `{ users: User[] }`                                |
| `error`               | General error              | `{ message: string }`                              |

## Database Schema

### User Model

```prisma
model User {
  id                String     @id @default(auto()) @map("_id") @db.ObjectId
  email             String     @unique
  password          String
  firstName         String
  lastName          String
  role              UserRole   @default(USER)
  status            UserStatus @default(PENDING_VERIFICATION)
  isOnline          Boolean    @default(false)
  emailVerified     Boolean    @default(false)
  // ... additional fields
}
```

### Session Model

```prisma
model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @db.ObjectId
  token        String   @unique
  refreshToken String   @unique
  expiresAt    DateTime
  isActive     Boolean  @default(true)
  // ... additional fields
}
```

## Development

### Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:push     # Push schema to database
npm run prisma:studio   # Open Prisma Studio
```

### Environment Variables

| Variable                    | Description                          | Required |
| --------------------------- | ------------------------------------ | -------- |
| `NODE_ENV`                  | Environment (development/production) | ✅       |
| `PORT`                      | Server port                          | ✅       |
| `DATABASE_URL`              | MongoDB connection string            | ✅       |
| `JWT_SECRET`                | JWT signing secret                   | ✅       |
| `JWT_REFRESH_SECRET`        | Refresh token secret                 | ✅       |
| `SMTP_HOST`                 | Email SMTP host                      | ✅       |
| `SMTP_PORT`                 | Email SMTP port                      | ✅       |
| `SMTP_USER`                 | Email username                       | ✅       |
| `SMTP_PASS`                 | Email password/app password          | ✅       |
| `FROM_EMAIL`                | From email address                   | ✅       |
| `FROM_NAME`                 | From name                            | ✅       |
| `FRONTEND_URL`              | Frontend URL for CORS                | ✅       |
| `EMAIL_VERIFICATION_SECRET` | Email verification secret            | ✅       |
| `PASSWORD_RESET_SECRET`     | Password reset secret                | ✅       |

## Deployment

### Vercel Deployment

1. **Create `vercel.json`** (already included)
2. **Set environment variables** in Vercel dashboard
3. **Deploy**:
   ```bash
   npx vercel --prod
   ```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP address to whitelist
4. Create a database user
5. Get connection string and add to `DATABASE_URL`

### Email Setup (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate an App Password
3. Use the app password in `SMTP_PASS`

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin only
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds 12
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: Helmet and input sanitization

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "details": {} // Additional error details (validation errors, etc.)
}
```

## Support

For issues and questions:

- Create an issue on GitHub
- Email: support@labfry.com

## License

MIT License - see LICENSE file for details
