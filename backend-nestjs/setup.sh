#!/bin/bash

echo "🚀 Setting up NestJS Backend for Labfry"
echo "======================================"

# Navigate to NestJS directory
cd /Users/pino/Documents/live/company/labfry-live/backend-nestjs

# Install dependencies
echo "📦 Installing NestJS dependencies..."
npm install

# Copy environment file
echo "🔧 Setting up environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file - please update with your actual values"
else
    echo "⚠️  .env file already exists"
fi

# Copy Prisma schema
echo "🗄️  Setting up database schema..."
mkdir -p prisma
if [ -f ../backend/prisma/schema.prisma ]; then
    cp ../backend/prisma/schema.prisma ./prisma/
    echo "✅ Copied Prisma schema from Express backend"
else
    echo "⚠️  Prisma schema not found - you'll need to create it manually"
fi

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npm run prisma:generate

# Build the application
echo "🔨 Building NestJS application..."
npm run build

echo ""
echo "✅ NestJS Backend Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env file with your actual configuration"
echo "2. Run: npm run start:dev"
echo "3. Visit: http://localhost:5000/api/docs"
echo ""
echo "🎯 Available Scripts:"
echo "  npm run start:dev    - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start:prod   - Start production server"
echo "  npm run test         - Run unit tests"
echo "  npm run test:e2e     - Run e2e tests"
echo ""
echo "📚 Documentation:"
echo "  Swagger UI: http://localhost:5000/api/docs"
echo "  Health Check: http://localhost:5000/api/health"
echo ""