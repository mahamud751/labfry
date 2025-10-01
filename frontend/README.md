# Labfry Frontend

Modern React/Next.js frontend application with authentication, real-time features, and role-based access control.

## 🚀 Features

- ✅ **Modern Stack**: Next.js 15, React 19, TypeScript
- 🔐 **Complete Authentication**: Login, Register, Email Verification, Password Reset
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔄 **Real-time Updates**: Socket.IO integration for live user presence
- 🗄️ **State Management**: Redux Toolkit for predictable state management
- 🎨 **UI Components**: Custom components following Figma designs
- 👥 **Role-based Access**: ADMIN, USER, CUSTOMER roles with permissions
- 🔔 **Toast Notifications**: Real-time feedback with react-hot-toast
- ⚡ **Hot Reload**: Development with Next.js fast refresh

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Backend API running (see backend README)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

3. **Configure your `.env.local`**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🗂️ Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── components/         # Shared UI components
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # User profile page
│   ├── forgot-password/   # Password reset request
│   ├── reset-password/    # Password reset form
│   ├── verify/            # Email verification
│   └── success/           # Success pages
├── src/
│   ├── components/        # React components
│   ├── store/            # Redux store and slices
│   ├── services/         # API and Socket.IO services
│   ├── types/            # TypeScript type definitions
│   └── lib/              # Utility libraries
└── public/               # Static assets
```

## 🔐 Authentication Flow

### Registration

1. User fills registration form
2. Backend validates and creates user
3. Verification email sent
4. User clicks verification link
5. Account activated

### Login

1. User enters credentials
2. Backend validates and returns JWT
3. Token stored in cookies + localStorage
4. Socket.IO auto-authenticates
5. Redirect to profile

### Password Reset

1. User requests password reset
2. Reset email sent with secure token
3. User clicks reset link
4. New password form
5. Password updated

## 🔄 Real-time Features

### Socket.IO Integration

- **Auto-connect**: Connects on app load
- **Auto-authenticate**: Uses JWT token
- **Online Presence**: Real-time user status
- **Toast Notifications**: Live status updates

### Events

- `user_online` - User comes online
- `user_offline` - User goes offline
- `user_status_changed` - Manual status toggle
- `status_updated` - Confirmation of status change

## 🗄️ State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  socket: {
    isConnected: boolean,
    isAuthenticated: boolean,
    onlineUsers: SocketUser[],
    connectionStatus: string
  }
}
```

### Key Actions

- `loginUser` - Authenticate user
- `registerUser` - Create new account
- `verifyEmail` - Verify email address
- `updateProfile` - Update user information
- `updateOnlineStatus` - Toggle online/offline

## 👥 Role-based Access

### User Roles

- **ADMIN**: Full access, user management
- **USER**: Standard user features
- **CUSTOMER**: Limited access, read-only

### Components

- `<RoleGuard>` - Restrict content by role
- `<PermissionCheck>` - Check specific permissions
- `<RoleBadge>` - Display user role
- `useRole()` - Hook for role logic

### Usage Example

```tsx
<RoleGuard allowedRoles={['ADMIN', 'USER']}>
  <AdminPanel />
</RoleGuard>

<PermissionCheck permission="write">
  <EditButton />
</PermissionCheck>
```

## 🎨 UI Components

### Core Components

- `<FloatingLabelInput>` - Animated form inputs
- `<Button>` - Styled button with variants
- `<AppProviders>` - Redux and Socket providers
- `<SocketProvider>` - Socket.IO management

### Design System

- **Colors**: Primary red (#EE3638), neutral grays
- **Typography**: Public Sans font family
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and hover effects

## 📱 Pages Overview

### Authentication Pages

- `/login` - User login form
- `/register` - User registration
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password form
- `/verify` - Email verification
- `/select-role` - Role selection (if needed)

### User Pages

- `/profile` - User profile management
- `/success` - Success confirmations

## 🔧 Environment Variables

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Production Setup

```env
# Production URLs
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.vercel.app
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Complete full-stack application"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Connect GitHub repository
   - Set environment variables in dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.vercel.app
   ```

### Build Optimization

- **Automatic code splitting**
- **Image optimization**
- **Font optimization**
- **Static generation where possible**

## 🔍 Testing

### Manual Testing Checklist

- [ ] User registration with email verification
- [ ] User login and logout
- [ ] Password reset flow
- [ ] Profile editing
- [ ] Online/offline status toggle
- [ ] Real-time user presence
- [ ] Role-based content display
- [ ] Mobile responsiveness
- [ ] Toast notifications

## 🎯 Performance Features

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Aggressive caching strategies

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **HTTP-only Cookies**: Secure token storage
- **Input Validation**: Client-side validation
- **XSS Protection**: React's built-in protection
- **CSRF Protection**: SameSite cookies

## 🐛 Troubleshooting

### Common Issues

1. **Socket.IO connection failed**

   - Check backend is running
   - Verify SOCKET_URL environment variable

2. **Authentication errors**

   - Check API_URL environment variable
   - Verify backend is accessible

3. **Build errors**
   - Clear .next directory: `rm -rf .next`
   - Reinstall dependencies: `npm ci`

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and Redux DevTools.

## 📞 Support

For issues and questions:

- Check the backend README for API setup
- Ensure all environment variables are set
- Verify backend services are running

## 📄 License

MIT License - see LICENSE file for details
