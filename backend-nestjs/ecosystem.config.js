module.exports = {
  apps: [{
    name: 'apilabfry',
    script: 'dist/main.js',
    instances: 1,  // Single instance to avoid port conflicts
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: "mongodb+srv://pino:01789999752Pt@cluster0.3x7mu.mongodb.net/labfry?retryWrites=true&w=majority",
      JWT_SECRET: "labfry_super_secret_jwt_key_for_development_at_least_32_characters_long_12345",
      JWT_REFRESH_SECRET: "labfry_super_secret_refresh_jwt_key_for_development_at_least_32_characters_67890",
      SMTP_HOST: "sandbox.smtp.mailtrap.io",
      SMTP_PORT: 2525,
      SMTP_USER: "7e3e7e934604f9",
      SMTP_PASS: "acf5c24e206b92",
      FROM_EMAIL: "crazysolve99@gmail.com",
      FROM_NAME: "Labfry Technology",
      FRONTEND_URL: "http://localhost:3001",
      FRONTEND_URL_NGINX: "http://localhost:3000",
      FRONTEND_URL_PRODUCTION: "https://labfry.pino7.com",
      FRONTEND_URL_SERVER: "http://93.127.199.59:3001",
      FRONTEND_URL_SERVER_NGINX: "http://93.127.199.59:3000",
      EMAIL_VERIFICATION_SECRET: "labfry_email_verification_secret_for_development_at_least_32_characters_abc123",
      PASSWORD_RESET_SECRET: "labfry_password_reset_secret_for_development_at_least_32_characters_def456"
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: "mongodb+srv://pino:01789999752Pt@cluster0.3x7mu.mongodb.net/labfry?retryWrites=true&w=majority",
      JWT_SECRET: "labfry_super_secret_jwt_key_for_development_at_least_32_characters_long_12345",
      JWT_REFRESH_SECRET: "labfry_super_secret_refresh_jwt_key_for_development_at_least_32_characters_67890",
      SMTP_HOST: "sandbox.smtp.mailtrap.io",
      SMTP_PORT: 2525,
      SMTP_USER: "7e3e7e934604f9",
      SMTP_PASS: "acf5c24e206b92",
      FROM_EMAIL: "crazysolve99@gmail.com",
      FROM_NAME: "Labfry Technology",
      FRONTEND_URL: "http://localhost:3001",
      FRONTEND_URL_NGINX: "http://localhost:3000",
      FRONTEND_URL_PRODUCTION: "https://labfry.pino7.com",
      FRONTEND_URL_SERVER: "http://93.127.199.59:3001",
      FRONTEND_URL_SERVER_NGINX: "http://93.127.199.59:3000",
      EMAIL_VERIFICATION_SECRET: "labfry_email_verification_secret_for_development_at_least_32_characters_abc123",
      PASSWORD_RESET_SECRET: "labfry_password_reset_secret_for_development_at_least_32_characters_def456"
    },
    // Restart options
    max_restarts: 10,
    min_uptime: '10s',
    
    // Fork mode configuration
    autorestart: true,
    
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
    
    // Environment variables from .env file
    env_file: '.env'
  }]
};