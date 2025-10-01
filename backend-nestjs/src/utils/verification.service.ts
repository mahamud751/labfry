export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getCodeExpiryTime(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
}

export function isCodeExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
}

export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}
