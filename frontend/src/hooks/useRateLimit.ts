import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

interface RateLimitError {
  message: string;
  retryAfter: number;
  retryAfterMs: number;
  timestamp: string;
}

interface RateLimitState {
  isRateLimited: boolean;
  retryAfter: number;
  message: string;
  canRetry: boolean;
}

export function useRateLimit() {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isRateLimited: false,
    retryAfter: 0,
    message: "",
    canRetry: true,
  });

  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setRateLimitState((state) => ({
              ...state,
              isRateLimited: false,
              canRetry: true,
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleRateLimitError = useCallback((error: any) => {
    // Check if this is a rate limit error (429 status)
    if (error?.response?.status === 429) {
      const data: RateLimitError = error.response.data;

      setRateLimitState({
        isRateLimited: true,
        retryAfter: data.retryAfter || 60,
        message: data.message || "Too many requests. Please try again later.",
        canRetry: false,
      });

      setCountdown(data.retryAfter || 60);

      // Show toast with countdown
      const toastId = toast.error(
        `${data.message} (${data.retryAfter || 60}s)`,
        {
          duration: Math.min((data.retryAfter || 60) * 1000, 10000), // Max 10 seconds
          id: "rate-limit-error",
        }
      );

      return true; // Indicates this was a rate limit error
    }

    return false; // Not a rate limit error
  }, []);

  const clearRateLimit = useCallback(() => {
    setRateLimitState({
      isRateLimited: false,
      retryAfter: 0,
      message: "",
      canRetry: true,
    });
    setCountdown(0);
    toast.dismiss("rate-limit-error");
  }, []);

  const formatCountdown = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }, []);

  return {
    ...rateLimitState,
    countdown,
    handleRateLimitError,
    clearRateLimit,
    formatCountdown,
    countdownText: formatCountdown(countdown),
  };
}
