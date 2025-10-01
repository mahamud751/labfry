#!/bin/bash

echo "🚀 Production Setup for Labfry NestJS Backend"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to backend-nestjs directory
cd /root/labfry/backend-nestjs

echo -e "${YELLOW}📦 Installing production dependencies...${NC}"
npm ci --production

echo -e "${YELLOW}⚙️  Generating Prisma client...${NC}"
npm run prisma:generate

echo -e "${YELLOW}🔨 Building application for production...${NC}"
npm run build

echo -e "${YELLOW}🔧 Setting up PM2 configuration...${NC}"

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'apilabfry',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Restart options
    max_restarts: 10,
    min_uptime: '10s',
    
    // Log options
    log_file: 'logs/combined.log',
    out_file: 'logs/out.log',
    error_file: 'logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced features
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Memory and CPU options
    max_memory_restart: '1G',
    
    // Health monitoring
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Environment variables from .env file
    env_file: '.env'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2 globally...${NC}"
    npm install -g pm2
fi

echo -e "${GREEN}✅ Production setup complete!${NC}"
echo ""
echo -e "${YELLOW}🚀 To start the application in production:${NC}"
echo "   pm2 start ecosystem.config.js --env production"
echo ""
echo -e "${YELLOW}📊 To monitor the application:${NC}"
echo "   pm2 status"
echo "   pm2 logs apilabfry"
echo "   pm2 monit"
echo ""
echo -e "${YELLOW}🔄 To restart the application:${NC}"
echo "   pm2 restart apilabfry"
echo ""
echo -e "${YELLOW}🛑 To stop the application:${NC}"
echo "   pm2 stop apilabfry"
echo ""
echo -e "${YELLOW}🗑️  To delete the application from PM2:${NC}"
echo "   pm2 delete apilabfry"
echo ""
echo -e "${YELLOW}💾 To save PM2 configuration:${NC}"
echo "   pm2 save"
echo "   pm2 startup"
echo ""