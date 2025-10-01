# 🚀 Labfry Full-Stack Authentication System

Complete full-stack application with authentication, real-time features, and role-based access control built for the Labfry Technology assessment.

## 📋 Project Overview

This project implements a comprehensive authentication system with:

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript + Prisma + MongoDB + Socket.IO
- **Authentication**: JWT-based with email verification and password reset
- **Real-time**: Socket.IO for user presence and live updates
- **State Management**: Redux Toolkit for predictable state management
- **Email Service**: Nodemailer for transactional emails
- **Deployment**: Ready for Vercel deployment

## ✨ Features Implemented

### 🔐 Authentication System

- [x] User registration with email verification
- [x] Secure login with JWT tokens
- [x] Password reset via email
- [x] Role-based authentication (ADMIN, USER, CUSTOMER)
- [x] Session management with refresh tokens
- [x] Account status management

### 📱 Frontend Features

- [x] Responsive design matching Figma specifications
- [x] Redux Toolkit for state management
- [x] Real-time Socket.IO integration
- [x] Toast notifications for user feedback
- [x] Form validation and error handling
- [x] Loading states and user feedback
- [x] Role-based content rendering

### 🔄 Real-time Features

- [x] Socket.IO connection management
- [x] User online/offline presence
- [x] Live status updates with toast notifications
- [x] Real-time user list
- [x] Connection status indicators

### 📧 Email Services

- [x] Email verification on registration
- [x] Password reset emails
- [x] Welcome emails post-verification
- [x] Professional HTML email templates
- [x] Nodemailer integration

### 🚀 Deployment Ready

- [x] Vercel configuration for both frontend and backend
- [x] Environment variables setup
- [x] Production-ready build configurations
- [x] MongoDB Atlas integration
- [x] Comprehensive deployment guide

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │────│   (Express)     │────│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 19      │    │ • TypeScript    │    │ • MongoDB Atlas │
│ • Redux Toolkit │    │ • Prisma ORM    │    │ • User Sessions │
│ • Socket.IO     │    │ • Socket.IO     │    │ • Email Tokens  │
│ • Tailwind CSS  │    │ • Nodemailer    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │      WebSocket        │
         └───────────────────────┘
```

## 📂 Project Structure

```
labfry-live/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router pages
│   │   ├── components/      # Shared UI components
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── profile/        # User profile page
│   │   └── ...             # Other auth pages
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API and Socket.IO services
│   │   └── types/         # TypeScript definitions
│   └── package.json
│
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript definitions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── DEPLOYMENT.md            # Comprehensive deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gmail account for email services

### 1. Clone Repository

```bash
git clone <repository-url>
cd labfry-live
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your MongoDB and email settings
# See DEPLOYMENT.md for detailed configuration

# Initialize database
npm run prisma:generate
npm run prisma:push

# Start backend
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local

# Configure API URLs
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Start frontend
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🎯 Assessment Requirements

### ✅ Required Features Completed

| Requirement                   | Status      | Implementation                      |
| ----------------------------- | ----------- | ----------------------------------- |
| **Authentication System**     | ✅ Complete | JWT-based auth with all flows       |
| **Figma Design Match**        | ✅ Complete | Pixel-perfect responsive design     |
| **Role-based Authentication** | ✅ Complete | ADMIN/USER/CUSTOMER roles           |
| **Real-time User Presence**   | ✅ Complete | Socket.IO online/offline status     |
| **Email Integration**         | ✅ Complete | Nodemailer with HTML templates      |
| **Redux State Management**    | ✅ Complete | Redux Toolkit implementation        |
| **Profile Toggle**            | ✅ Complete | Socket events + toast notifications |
| **Production Deployment**     | ✅ Complete | Vercel-ready configuration          |

### 🛠️ Technology Stack

#### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **Real-time**: Socket.IO Client
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with interceptors

#### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate limiting

#### Deployment

- **Frontend**: Vercel
- **Backend**: Vercel Functions
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | User registration      |
| POST   | `/api/auth/login`           | User login             |
| POST   | `/api/auth/verify-email`    | Email verification     |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password         |
| POST   | `/api/auth/refresh`         | Refresh access token   |
| POST   | `/api/auth/logout`          | User logout            |
| GET    | `/api/auth/profile`         | Get user profile       |
| PUT    | `/api/auth/profile`         | Update profile         |
| PUT    | `/api/auth/online-status`   | Update online status   |

### Socket.IO Events

| Event                  | Direction       | Description                    |
| ---------------------- | --------------- | ------------------------------ |
| `authenticate`         | Client → Server | Authenticate socket connection |
| `update_online_status` | Client → Server | Toggle online/offline status   |
| `user_online`          | Server → Client | User came online               |
| `user_offline`         | Server → Client | User went offline              |
| `status_updated`       | Server → Client | Status change confirmation     |

## 🚀 Deployment

### Quick Deployment

1. **Database**: Set up MongoDB Atlas cluster
2. **Email**: Configure Gmail App Password
3. **Backend**: Deploy to Vercel with environment variables
4. **Frontend**: Deploy to Vercel with API URLs
5. **Testing**: Verify all functionality works

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

### Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend.vercel.app/api`
- **Health Check**: `https://your-backend.vercel.app/health`

## 🧪 Testing

### Manual Test Scenarios

1. **Registration Flow**
   - Register new user → Email verification → Account activation
2. **Authentication Flow**
   - Login → Profile access → Logout
3. **Password Reset**
   - Request reset → Email received → Password updated
4. **Real-time Features**
   - Online status toggle → Socket events → Toast notifications
5. **Role-based Access**
   - Different content for ADMIN/USER/CUSTOMER roles

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured for specific origins
- **HTTP-only Cookies**: Secure token storage
- **Environment Secrets**: All sensitive data in environment variables

## 📱 Responsive Design

The application is fully responsive and tested on:

- **Desktop**: 1920px and above
- **Tablet**: 768px - 1919px
- **Mobile**: 320px - 767px

## 📄 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation
- **[backend/README.md](./backend/README.md)** - Backend documentation

## 🎉 Project Deliverables

### GitHub Repositories

- **Frontend**: Complete Next.js application
- **Backend**: Complete Express.js API

### Live URLs

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Vercel

### Features Demonstrated

- ✅ Authentication system with email verification
- ✅ Role-based access control
- ✅ Real-time user presence with Socket.IO
- ✅ Email integration with Nodemailer
- ✅ Redux state management
- ✅ Responsive design matching Figma
- ✅ Production deployment

## 👨‍💻 Development Team

Built with ❤️ for Labfry Technology assessment.

**Tech Stack Highlights**:

- Modern React 19 with Next.js 15
- Full TypeScript implementation
- Real-time Socket.IO integration
- Professional email templates
- Production-ready architecture
- Comprehensive error handling
- Security best practices

---

_This project demonstrates a complete understanding of modern full-stack development, from authentication systems to real-time features and production deployment._
# labfry
