import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

let ROOT_DIR = process.cwd();
try {
  if (typeof __dirname !== 'undefined') {
    ROOT_DIR = path.resolve(__dirname, '../../');
  } else if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
    const filename = fileURLToPath(import.meta.url);
    ROOT_DIR = path.resolve(path.dirname(filename), '../../');
  }
} catch {
  ROOT_DIR = process.cwd();
}
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'data') : path.join(ROOT_DIR, 'data');
const SEED_DATA_DIR = path.join(ROOT_DIR, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // format: "salt:hash"
  createdAt: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
  createdAt: string;
}

// In-memory fallbacks for serverless environments
let memoryUsers: UserRecord[] = [];
let memorySessions: SessionRecord[] = [];

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem warning suppressed
}

function loadUsers(): UserRecord[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed;
        return parsed;
      }
    }
    // Check seed file
    const seedFile = path.join(SEED_DATA_DIR, 'users.json');
    if (fs.existsSync(seedFile)) {
      const data = fs.readFileSync(seedFile, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryUsers = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  return memoryUsers;
}

function saveUsers(users: UserRecord[]): void {
  memoryUsers = users;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write fallback to memory for users:', err);
  }
}

function loadSessions(): SessionRecord[] {
  try {
    const now = Date.now();
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memorySessions = parsed.filter(s => s.expiresAt > now);
        return memorySessions;
      }
    }
  } catch (err) {
    console.error('Error reading sessions file:', err);
  }
  return memorySessions.filter(s => s.expiresAt > Date.now());
}

function saveSessions(sessions: SessionRecord[]): void {
  memorySessions = sessions;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write fallback to memory for sessions:', err);
  }
}

/**
 * Hash password using Node's standard crypto.scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored salt:hash using constant-time comparison
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHashHex] = parts;
    const originalHash = Buffer.from(originalHashHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(originalHash, derivedKey);
  } catch {
    return false;
  }
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

/**
 * Register a new user
 */
export function registerUser(name: string, email: string, password: string): { user?: PublicUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName || cleanName.length < 2) {
    return { error: 'Full name must be at least 2 characters.' };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { error: 'Please provide a valid email address.' };
  }

  // Password validation: minimum 8 characters, at least 1 letter and 1 number
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { error: 'Password must contain both letters and numbers.' };
  }

  const users = loadUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { error: 'An account with this email address already exists.' };
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return { user: toPublicUser(newUser) };
}

/**
 * Authenticate user with email and password
 */
export function authenticateUser(email: string, password: string): { user?: UserRecord; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { error: 'Invalid email or password.' };
  }

  return { user };
}

/**
 * Create a new cryptographically secure session
 */
export function createSession(userId: string, rememberMe = false): string {
  const token = `jsh_${crypto.randomBytes(32).toString('hex')}`;
  const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  const sessions = loadSessions();

  sessions.push({
    token,
    userId,
    expiresAt: Date.now() + durationMs,
    createdAt: new Date().toISOString()
  });

  saveSessions(sessions);
  return token;
}

/**
 * Get user by session token
 */
export function getUserBySessionToken(token?: string): PublicUser | null {
  if (!token) return null;
  const sessions = loadSessions();
  const session = sessions.find(s => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;

  const users = loadUsers();
  const user = users.find(u => u.id === session.userId);
  if (!user) return null;

  return toPublicUser(user);
}

/**
 * Destroy a session token
 */
export function destroySession(token: string): void {
  const sessions = loadSessions();
  const remaining = sessions.filter(s => s.token !== token);
  saveSessions(remaining);
}

/**
 * Generate password reset token
 */
export function createPasswordResetToken(email: string): { token?: string; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // For privacy, return generic success or specific message
    return { error: 'No account found with this email address.' };
  }

  const resetToken = `rst_${crypto.randomBytes(24).toString('hex')}`;
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  saveUsers(users);
  return { token: resetToken };
}

/**
 * Reset password using token
 */
export function resetPasswordWithToken(token: string, newPassword: string): { success?: boolean; error?: string } {
  if (!token || !token.trim()) {
    return { error: 'Invalid or missing reset token.' };
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters long.' };
  }
  if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return { error: 'New password must contain both letters and numbers.' };
  }

  const users = loadUsers();
  const now = Date.now();
  const user = users.find(u => u.resetToken === token && (u.resetTokenExpiry || 0) > now);

  if (!user) {
    return { error: 'Password reset link has expired or is invalid.' };
  }

  user.passwordHash = hashPassword(newPassword);
  delete user.resetToken;
  delete user.resetTokenExpiry;

  saveUsers(users);
  return { success: true };
}
