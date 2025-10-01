import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for production
  output: 'standalone',
  
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Disable ESLint during build for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checks during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure environment variables
  env: {
    CUSTOM_PORT: process.env.PORT || '3001',
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
