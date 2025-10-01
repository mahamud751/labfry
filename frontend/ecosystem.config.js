module.exports = {
  apps: [{
    name: 'labfry-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/root/labfry/frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      NEXT_PUBLIC_API_URL: 'https://apilabfry.pino7.com/api',
      NEXT_PUBLIC_SOCKET_URL: 'https://apilabfry.pino7.com',
      NEXT_PUBLIC_FRONTEND_URL: 'http://localhost:3001'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      NEXT_PUBLIC_API_URL: 'https://apilabfry.pino7.com/api',
      NEXT_PUBLIC_SOCKET_URL: 'https://apilabfry.pino7.com',
      NEXT_PUBLIC_FRONTEND_URL: 'http://localhost:3001'
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
    ignore_watch: ['node_modules', 'logs', '.next'],
    
    // Memory and CPU options
    max_memory_restart: '512M',
    
    // Health monitoring
    kill_timeout: 5000,
    listen_timeout: 3000
  }]
};