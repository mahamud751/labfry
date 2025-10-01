# Email Verification System with Rate Limiting

This document outlines the implementation of a robust email verification system that supports both traditional token-based verification and modern code-based verification, along with comprehensive rate limiting to prevent abuse.

## 🎯 Features Implemented

### 1. **Dual Verification Methods**

- **Token-based**: Traditional email links with JWT tokens (24-hour expiry)
- **Code-based**: 6-digit numeric codes (15-minute expiry)
- **Backward compatibility**: Supports both methods simultaneously

### 2. **Rate Limiting Protection**

- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Email sending**: 2 emails per 5 minutes per IP
- **Verification attempts**: 3 attempts per 15 minutes per IP

### 3. **Enhanced Security**

- **Automatic code generation**: Cryptographically secure 6-digit codes
- **Expiry management**: Automatic cleanup of expired codes/tokens
- **Input validation**: Strict validation for all user inputs
- **SQL injection protection**: Prisma ORM with parameterized queries

### 4. **User Experience Improvements**

- **Smart code input**: Auto-focus, paste support, keyboard navigation
- **Resend functionality**: 60-second cooldown with visual feedback
- **Error handling**: Clear, actionable error messages
- **Loading states**: Visual feedback during API calls

## 🛠 Technical Implementation

### Backend Changes

#### New Middleware

```typescript
// Rate limiting middleware with different tiers
export const authRateLimit = rateLimit({ max: 5, windowMs: 15 * 60 * 1000 });
export const emailRateLimit = rateLimit({ max: 2, windowMs: 5 * 60 * 1000 });
export const verificationRateLimit = rateLimit({
  max: 3,
  windowMs: 15 * 60 * 1000,
});
```

#### Database Schema Updates

```prisma
model User {
  // ... existing fields
  emailVerificationCode String?
  emailVerificationCodeExpiry DateTime?
  passwordResetCode String?
  passwordResetCodeExpiry DateTime?
}
```

#### New Utility Functions

```typescript
export function generateVerificationCode(): string;
export function getCodeExpiryTime(): Date;
export function isValidCodeFormat(code: string): boolean;
```

#### Enhanced Email Templates

- **Visual code display**: Prominent, styled 6-digit codes
- **Dual content**: Both link and code options
- **Expiry information**: Clear expiration times
- **Professional styling**: Consistent branding

### Frontend Changes

#### Updated Verification UI

- **Code input grid**: 6 individual input fields
- **Smart navigation**: Auto-advance and backspace handling
- **Paste support**: Automatic code splitting and filling
- **Visual feedback**: Loading states and error handling

#### Enhanced Auth Flow

- **Flexible verification**: Supports both token and code methods
- **Resend functionality**: Built-in cooldown and rate limiting
- **Error recovery**: Clear codes on failure, focus management
- **Success routing**: Context-aware redirects

## 📧 Email Templates

### Verification Email

```html
<!-- Code-based verification -->
<div style="background: #f8f9fa; border: 2px solid #EE3638; padding: 20px;">
  <h3>Your Verification Code</h3>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">
    123456
  </div>
  <p>This code expires in 15 minutes</p>
</div>
```

### Rate Limit Response

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## 🔐 Security Measures

### Rate Limiting Strategy

1. **IP-based tracking**: Prevents single-source abuse
2. **Endpoint-specific limits**: Tailored protection levels
3. **Graceful degradation**: Clear error messages
4. **Standard headers**: Proper HTTP rate limit headers

### Code Security

1. **Cryptographic generation**: Secure random number generation
2. **Short expiry**: 15-minute code lifetime
3. **Single use**: Codes invalidated after successful verification
4. **Format validation**: Strict 6-digit numeric format

### Token Security

1. **JWT implementation**: Signed tokens with expiry
2. **Secure storage**: HTTP-only cookies when possible
3. **Automatic cleanup**: Expired tokens removed from database
4. **Signature verification**: Prevents token tampering

## 🧪 Testing

### Manual Testing Steps

1. **Registration Flow**

   - Register with new email
   - Receive code in email
   - Enter code in verification UI
   - Verify successful account activation

2. **Rate Limiting**

   - Attempt multiple rapid registrations
   - Verify rate limit enforcement
   - Check error message clarity

3. **Code Expiry**

   - Generate verification code
   - Wait 15+ minutes
   - Attempt verification
   - Verify expiry handling

4. **Resend Functionality**
   - Request new code
   - Verify cooldown period
   - Test multiple resend attempts

### Automated Testing

- **Unit tests**: Verification utility functions
- **Integration tests**: API endpoint validation
- **Rate limit tests**: Middleware enforcement
- **Schema validation**: Input validation tests

## 🚀 Deployment Considerations

### Environment Variables

```env
# Rate limiting (optional - defaults provided)
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # requests per window

# Email configuration (required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME="Labfry Technology"
FROM_EMAIL=noreply@labfry.com
```

### Production Setup

1. **Database migration**: Run Prisma migrations
2. **SMTP configuration**: Configure email service
3. **Rate limiting**: Consider Redis for distributed rate limiting
4. **Monitoring**: Set up logging for rate limit violations

## 📋 API Endpoints

### New/Updated Endpoints

#### POST `/api/auth/verify-email`

**Request (Code-based):**

```json
{
  "code": "123456",
  "email": "user@example.com"
}
```

**Request (Token-based):**

```json
{
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/resend-verification`

**Request:**

```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`

**Request (Code-based):**

```json
{
  "code": "654321",
  "email": "user@example.com",
  "password": "newPassword123"
}
```

## 🎨 UI/UX Features

### Code Input Component

- **Responsive design**: Works on mobile and desktop
- **Accessibility**: Proper labels and keyboard navigation
- **Visual feedback**: Focus states and error highlighting
- **Smart behavior**: Auto-advance, paste handling, error recovery

### Error Handling

- **Rate limit messages**: Clear explanations and retry timing
- **Validation errors**: Specific field-level feedback
- **Network errors**: Graceful fallback and retry options
- **Success states**: Confirmation and next-step guidance

## 🔄 Migration Notes

### Backward Compatibility

- **Existing tokens**: Continue to work during transition
- **API compatibility**: All existing endpoints maintain functionality
- **Database migration**: Adds new fields without breaking existing data
- **Client support**: Frontend gracefully handles both verification methods

### Rollout Strategy

1. **Deploy backend**: Rate limiting and dual verification support
2. **Update frontend**: Enhanced verification UI
3. **Monitor metrics**: Track verification success rates
4. **Optimize settings**: Adjust rate limits based on usage patterns

## 📈 Monitoring & Analytics

### Key Metrics

- **Verification success rate**: Track code vs token success
- **Rate limit violations**: Monitor abuse attempts
- **Email delivery rates**: Ensure reliable email sending
- **User experience**: Track verification completion times

### Logging

- **Rate limit hits**: Log IP addresses and timestamps
- **Failed verifications**: Track patterns and potential issues
- **Code generation**: Log for debugging (without exposing codes)
- **Email sending**: Track delivery status and failures

---

This implementation provides a robust, secure, and user-friendly email verification system that scales with your application's needs while protecting against abuse and ensuring excellent user experience.
