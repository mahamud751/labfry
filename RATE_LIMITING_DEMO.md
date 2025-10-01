# 🚦 Rate Limiting with Smart Countdown Timers

## 🎯 Problem Solved

**Before:** Users saw generic "Too many requests, try again later" messages with no indication of when they could retry.

**After:** Users get specific countdown timers and clear information about when they can try again.

## 🔧 Implementation Details

### Backend Response Format

When rate limit is hit, the API now returns:

```json
{
  "success": false,
  "message": "Too many requests. Please try again in 2 minutes.",
  "retryAfter": 120,
  "retryAfterMs": 120000,
  "timestamp": "2024-10-01T18:30:45.123Z"
}
```

### Rate Limit Tiers

| Endpoint Type     | Limit        | Window     | Use Case                    |
| ----------------- | ------------ | ---------- | --------------------------- |
| **Login/Auth**    | 5 requests   | 15 minutes | Prevent brute force attacks |
| **Email Sending** | 2 requests   | 5 minutes  | Prevent email spam          |
| **Verification**  | 3 attempts   | 15 minutes | Prevent code guessing       |
| **General API**   | 100 requests | 15 minutes | Overall system protection   |

### Smart Message Format

The system automatically formats messages based on remaining time:

- **< 60 seconds**: "Please try again in 45 seconds."
- **< 60 minutes**: "Please try again in 3 minutes."
- **≥ 60 minutes**: "Please try again in 1 hour."

## 🎨 Frontend Integration

### Real-time Countdown

```typescript
// Button states with countdown
{
  isRateLimited ? `Wait ${countdownText}` : "Login";
}

// Examples:
("Wait 2m 30s"); // 2 minutes 30 seconds remaining
("Wait 45s"); // 45 seconds remaining
("Wait 1h 15m"); // 1 hour 15 minutes remaining
```

### Visual Feedback

- **Disabled buttons** during rate limit period
- **Real-time countdown** updates every second
- **Automatic re-enable** when countdown reaches zero
- **Toast notifications** with rate limit information

## 🧪 Testing Scenarios

### Login Rate Limiting (5 attempts in 15 minutes)

1. **Attempt 1-5**: Normal login attempts
2. **Attempt 6**: Returns rate limit response:
   ```json
   {
     "success": false,
     "message": "Too many requests. Please try again in 15 minutes.",
     "retryAfter": 900
   }
   ```
3. **Frontend shows**: "Wait 15m" on login button
4. **After countdown**: Button automatically re-enables

### Email Rate Limiting (2 emails in 5 minutes)

1. **Request 1-2**: Email sent successfully
2. **Request 3**: Rate limited:
   ```json
   {
     "success": false,
     "message": "Too many email requests. Please try again in 3 minutes.",
     "retryAfter": 180
   }
   ```
3. **Resend button shows**: "Wait 3m"
4. **Countdown decreases**: "Wait 2m 59s", "Wait 2m 58s", etc.

### Verification Rate Limiting (3 attempts in 15 minutes)

1. **Attempt 1-3**: Code verification attempts
2. **Attempt 4**: Rate limited:
   ```json
   {
     "success": false,
     "message": "Too many verification attempts. Please try again in 14 minutes.",
     "retryAfter": 840
   }
   ```
3. **Verify button disabled** with countdown display

## 📱 User Experience Examples

### Login Page

```
┌─────────────────────────────────┐
│ Email: [user@example.com      ] │
│ Password: [••••••••••••••••••] │
│                                 │
│ [  Wait 2m 15s  ] (disabled)   │
│                                 │
│ Too many login attempts.        │
│ Please try again in 2 minutes.  │
└─────────────────────────────────┘
```

### Verification Page

```
┌─────────────────────────────────┐
│ Enter 6-digit code:             │
│ [1][2][3][4][5][6]             │
│                                 │
│ [    Verify    ]               │
│                                 │
│ Don't have a code?              │
│ Wait 1m 30s (disabled)         │
└─────────────────────────────────┘
```

## 🔧 Configuration

### Environment Variables

```env
# Rate limiting is automatically configured
# No additional environment variables needed
```

### Customization Options

To adjust rate limits, modify `backend/src/middleware/rateLimit.ts`:

```typescript
// Example: Increase login attempts to 10
export const authRateLimit = rateLimit({
  max: 10, // Changed from 5 to 10
  windowMs: 15 * 60 * 1000,
  // ... rest of config
});
```

## 🚀 Production Considerations

### Redis Integration (Optional)

For distributed systems, consider using Redis store:

```typescript
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

const redisClient = createClient();

export const authRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  // ... rest of config
});
```

### Monitoring & Alerts

Track rate limit violations:

- **CloudWatch/DataDog**: Log rate limit hits
- **Alerting**: Notify on suspicious patterns
- **Analytics**: Track user behavior patterns

## 🎯 Benefits

### For Users

- ✅ **Clear expectations**: Know exactly when they can try again
- ✅ **No guessing**: Real-time countdown eliminates uncertainty
- ✅ **Better UX**: Visual feedback and automatic re-enabling
- ✅ **Mobile-friendly**: Works perfectly on all devices

### For System

- ✅ **Abuse prevention**: Multi-tier protection against attacks
- ✅ **Resource protection**: Prevents system overload
- ✅ **Scalable**: Works with high traffic volumes
- ✅ **Monitoring**: Built-in logging and metrics

## 🔍 Error Response Examples

### Login Rate Limit

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 900
Content-Type: application/json

{
  "success": false,
  "message": "Too many requests. Please try again in 15 minutes.",
  "retryAfter": 900,
  "retryAfterMs": 900000,
  "timestamp": "2024-10-01T18:30:45.123Z"
}
```

### Email Rate Limit

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 180
Content-Type: application/json

{
  "success": false,
  "message": "Too many email requests. Please try again in 3 minutes.",
  "retryAfter": 180,
  "retryAfterMs": 180000,
  "timestamp": "2024-10-01T18:30:45.123Z"
}
```

### Verification Rate Limit

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 840
Content-Type: application/json

{
  "success": false,
  "message": "Too many verification attempts. Please try again in 14 minutes.",
  "retryAfter": 840,
  "retryAfterMs": 840000,
  "timestamp": "2024-10-01T18:30:45.123Z"
}
```

---

## 🎊 Result

Users now get clear, actionable feedback when rate limited, with real-time countdown timers that automatically re-enable functionality when the waiting period is over. No more guessing games or frustrating "try again later" messages!
