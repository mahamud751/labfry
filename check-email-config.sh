#!/bin/bash

# Email Configuration Fix Script for Labfry Backend
# This script helps you update your email configuration from Mailtrap to Gmail

echo "🔧 Labfry Email Configuration Fix"
echo "================================="
echo ""

# Check current configuration
echo "📋 Current Configuration:"
echo "SMTP_HOST: $(grep SMTP_HOST backend/.env | cut -d'=' -f2)"
echo "SMTP_PORT: $(grep SMTP_PORT backend/.env | cut -d'=' -f2)"
echo "FROM_EMAIL: $(grep FROM_EMAIL backend/.env | cut -d'=' -f2)"
echo ""

# Check if using Mailtrap
if grep -q "mailtrap" backend/.env; then
    echo "⚠️  ISSUE DETECTED: You're using Mailtrap!"
    echo "Mailtrap is a testing service that catches emails but doesn't deliver them to real addresses."
    echo "This is why your password reset emails are not being received."
    echo ""
    
    echo "🔨 SOLUTION:"
    echo "1. Set up Gmail SMTP (recommended) or another email provider"
    echo "2. Update your .env configuration"
    echo "3. Restart the backend server"
    echo ""
    
    echo "📧 Gmail Setup Steps:"
    echo "1. Go to your Gmail account settings"
    echo "2. Enable 2-Factor Authentication"
    echo "3. Generate an App Password:"
    echo "   - Google Account → Security → 2-Step Verification → App passwords"
    echo "   - Select 'Mail' and 'Other (custom name)' → Enter 'Labfry Backend'"
    echo "   - Copy the 16-character password"
    echo ""
    
    echo "🔄 To fix your configuration:"
    echo "Replace these lines in backend/.env:"
    echo ""
    echo "# CHANGE FROM:"
    echo "SMTP_HOST=sandbox.smtp.mailtrap.io"
    echo "SMTP_PORT=2525"
    echo "SMTP_USER=dae3ef3db8e586"
    echo "SMTP_PASS=53ac1dd77c0f30"
    echo ""
    echo "# CHANGE TO:"
    echo "SMTP_HOST=smtp.gmail.com"
    echo "SMTP_PORT=587" 
    echo "SMTP_USER=your-gmail@gmail.com"
    echo "SMTP_PASS=your-16-char-app-password"
    echo ""
    
    echo "💡 Alternative Email Providers:"
    echo "- SendGrid: SMTP_HOST=smtp.sendgrid.net"
    echo "- Mailgun: SMTP_HOST=smtp.mailgun.org"  
    echo "- Amazon SES: SMTP_HOST=email-smtp.us-east-1.amazonaws.com"
    echo ""
    
    echo "✅ After updating:"
    echo "1. Save the .env file"
    echo "2. Restart the backend server (Ctrl+C then npm run dev)"
    echo "3. Test password reset at http://localhost:3001/forgot-password"
    echo ""
    
    echo "🔍 You can test your email configuration by visiting:"
    echo "http://localhost:5000/api/auth/email-health"
    echo ""
else
    echo "✅ Email configuration looks good!"
    echo "If you're still not receiving emails, please check:"
    echo "1. Your email provider settings"
    echo "2. App passwords are correctly configured"
    echo "3. Check spam/junk folder"
    echo ""
fi

echo "📝 Need help? Check EMAIL_FIX_GUIDE.md for detailed instructions."