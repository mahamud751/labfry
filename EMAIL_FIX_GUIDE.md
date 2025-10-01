# 📧 Email Configuration Fix Guide

## Problem

Your password reset emails are not being delivered because you're using **Mailtrap** (a testing email service) instead of a real email provider. Mailtrap only catches emails for testing but doesn't deliver them to actual email addresses.

## Solution

Switch from Mailtrap to Gmail SMTP for email delivery.

## Steps to Fix

### 1. Enable Gmail SMTP

1. Go to your Gmail account settings
2. Enable 2-Factor Authentication (if not already enabled)
3. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (custom name)" → Enter "Labfry Backend"
   - Copy the 16-character password (remove spaces)

### 2. Create Production Email Configuration

Create a `.env.production` file with real email settings:

```env
# Production Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=Labfry Technology
```

### 3. Alternative Email Providers

If you don't want to use Gmail, here are other options:

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-user
SMTP_PASS=your-mailgun-password
```

#### Amazon SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-access-key
SMTP_PASS=your-ses-secret-key
```

## Testing the Fix

1. Update your `.env` file with real SMTP settings
2. Restart the backend server
3. Go to http://localhost:3002/forgot-password
4. Enter a real email address
5. Check your email inbox (including spam folder)

## Current Configuration (Mailtrap - Testing Only)

Your current configuration in `.env`:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=dae3ef3db8e586
SMTP_PASS=53ac1dd77c0f30
```

This configuration only works for testing and emails are caught in your Mailtrap inbox at https://mailtrap.io - they never reach real email addresses.

## Immediate Fix

Replace the SMTP settings in your `.env` file with Gmail configuration and restart the backend server.
