# 🚀 Deployment Guide - Labfry Full-Stack Application

Complete guide for deploying the Labfry authentication system to production.

## 📋 Prerequisites

Before deployment, ensure you have:

- [x] MongoDB Atlas account and cluster
- [x] Gmail account with App Password enabled
- [x] Vercel account (for deployment)
- [x] GitHub account (for code hosting)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in
3. Create a new project: "Labfry"

### 2. Create Database Cluster

1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE)
3. Select your preferred region
4. Name cluster: "labfry-cluster"

### 3. Configure Database Access

1. **Database User**:

   - Username: `labfry-admin`
   - Password: Generate secure password
   - Role: `Atlas admin`

2. **Network Access**:
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - Or add specific Vercel IPs for security

### 4. Get Connection String

1. Click "Connect" → "Connect your application"
2. Copy connection string:

```
mongodb+srv://labfry-admin:<password>@labfry-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 📧 Email Setup (Gmail)

### 1. Enable 2-Factor Authentication

1. Go to Google Account settings
2. Enable 2-Factor Authentication

### 2. Generate App Password

1. Google Account → Security → App passwords
2. Select app: "Mail"
3. Select device: "Other" → "Labfry Backend"
4. Copy the 16-character password

### 3. Email Configuration

- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587`
- **Username**: Your Gmail address
- **Password**: App password (not your regular password)

## 🔧 Backend Deployment (Vercel)

### 1. Prepare Backend Code

```bash
cd backend
npm install
npm run build  # Test build locally
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel

# Follow prompts:
# Project name: labfry-backend
# Directory: ./
# Build command: npm run build
# Output directory: dist
```

### 3. Configure Environment Variables in Vercel

Go to Vercel Dashboard → Project → Settings → Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://labfry-admin:<password>@labfry-cluster.xxxxx.mongodb.net/labfry?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure_at_least_64_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_very_long_and_secure_64_chars
EMAIL_VERIFICATION_SECRET=your_email_verification_secret_here_make_it_long_and_secure_64_characters
PASSWORD_RESET_SECRET=your_password_reset_secret_here_make_it_long_and_secure_64_characters
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Labfry Technology
FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Initialize Database

After deployment, the database will auto-initialize with Prisma schema.

### 5. Test Backend

```bash
curl https://your-backend.vercel.app/health
# Should return: {"success": true, "message": "Server is healthy"}
```

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend Code

```bash
cd frontend
npm install
npm run build  # Test build locally
```

### 2. Deploy to Vercel

```bash
cd frontend
vercel

# Follow prompts:
# Project name: labfry-frontend
# Framework: Next.js
# Build command: npm run build
# Output directory: .next
```

### 3. Configure Environment Variables

Go to Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.vercel.app
```

### 4. Update Backend CORS

Update backend environment variable:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🔗 Final Configuration

### 1. Update URLs

Replace placeholder URLs in both deployments:

**Backend** (`FRONTEND_URL`):

```env
FRONTEND_URL=https://labfry-frontend-xxxxx.vercel.app
```

**Frontend** (Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://labfry-backend-xxxxx.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://labfry-backend-xxxxx.vercel.app
```

### 2. Redeploy Both Applications

```bash
# Redeploy backend
cd backend
vercel --prod

# Redeploy frontend
cd frontend
vercel --prod
```

## ✅ Testing Deployment

### 1. Backend Health Check

```bash
curl https://your-backend.vercel.app/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "onlineUsers": 0,
  "environment": "production"
}
```

### 2. API Endpoints Test

```bash
# Test registration
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 3. Frontend Functionality

Visit your frontend URL and test:

- [ ] Page loads correctly
- [ ] Registration form works
- [ ] Email verification (check inbox)
- [ ] Login functionality
- [ ] Profile page access
- [ ] Online/offline toggle
- [ ] Real-time Socket.IO connection
- [ ] Responsive design on mobile

## 🔒 Security Checklist

### Production Security

- [ ] All secrets are properly configured
- [ ] JWT secrets are long and secure (64+ characters)
- [ ] Database has restricted network access
- [ ] CORS is configured for specific domains
- [ ] Email credentials are secure (App Password)
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enforced (automatic with Vercel)

### Environment Validation

- [ ] All required environment variables set
- [ ] No development URLs in production
- [ ] Database connection working
- [ ] Email service working
- [ ] Socket.IO connection working

## 📊 Monitoring & Maintenance

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor performance and errors
3. Set up alerts for downtime

### Database Monitoring

1. Monitor MongoDB Atlas metrics
2. Set up alerts for connection issues
3. Regular backup verification

### Logs & Debugging

```bash
# View Vercel function logs
vercel logs https://your-backend.vercel.app

# View build logs
vercel logs --build
```

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID_BACKEND }}
          working-directory: ./backend

      - name: Deploy Frontend
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID_FRONTEND }}
          working-directory: ./frontend
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```
   Error: Invalid MongoDB connection string
   ```

   - Verify connection string format
   - Check username/password
   - Ensure IP whitelist includes 0.0.0.0/0

2. **Email Service Failed**

   ```
   Error: Invalid login: 535 Authentication failed
   ```

   - Verify App Password (not regular password)
   - Check 2FA is enabled
   - Verify SMTP settings

3. **CORS Errors**

   ```
   Error: CORS policy blocked request
   ```

   - Verify FRONTEND_URL in backend
   - Check environment variables
   - Ensure no trailing slashes

4. **Socket.IO Connection Failed**

   ```
   Error: WebSocket connection failed
   ```

   - Check SOCKET_URL environment variable
   - Verify backend deployment
   - Test with polling transport

5. **Build Failures**
   ```
   Error: Module not found
   ```
   - Check package.json dependencies
   - Verify import paths
   - Clear build cache

### Quick Fixes

```bash
# Clear Vercel cache
vercel --force

# Check environment variables
vercel env ls

# View real-time logs
vercel logs --follow
```

## 📞 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check database connectivity
5. Verify email service configuration

## 🎉 Success!

Your Labfry full-stack application is now live!

**Frontend URL**: https://your-frontend.vercel.app
**Backend API**: https://your-backend.vercel.app/api

Share these URLs as your project deliverables.
