import { createHash } from 'crypto';

export const adminAuth = {
  email: process.env.ADMIN_EMAIL || 'admin@bostarcoating.com',
  passwordHash:
    process.env.ADMIN_PASSWORD_HASH ||
    'ee70b06a43cd441a573387122b3342995dd3a5363d69122a0f923dc2153ab83e',
  sessionSecret: process.env.ADMIN_SESSION_SECRET || 'change-this-session-secret-before-production',
  cookieName: 'bostar_admin_session',
};

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function createSessionToken() {
  return sha256(`${adminAuth.email}:${adminAuth.passwordHash}:${adminAuth.sessionSecret}`);
}

export function isValidAdminSessionToken(token?: string) {
  return Boolean(token) && token === createSessionToken();
}

export function verifyAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === adminAuth.email.toLowerCase() &&
    sha256(password) === adminAuth.passwordHash
  );
}
