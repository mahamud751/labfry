import crypto from "crypto";

/**
 * Generate a 6-digit numeric verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Check if a verification code is expired
 */
export function isCodeExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
}

/**
 * Get code expiry time (15 minutes from now)
 */
export function getCodeExpiryTime(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
}

/**
 * Get token expiry time (24 hours from now)
 */
export function getTokenExpiryTime(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
}

/**
 * Validate verification code format
 */
export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}
