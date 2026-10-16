import express, { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// IN-MEMORY SECURE SESSION STORE
interface Session {
  userId: string;
  role: 'admin';
  expiresAt: number;
}
const sessions = new Map<string, Session>();

// SECURE PASSWORD STORAGE (Salted hash)
// Defaults to ADMIN_PASSWORD env var or initial setup password if not configured
let adminSalt = crypto.randomBytes(16).toString('hex');
let adminHash = crypto
  .pbkdf2Sync(process.env.ADMIN_PASSWORD || 'SpaceApps2026!Egypt', adminSalt, 10000, 64, 'sha512')
  .toString('hex');

// API: Verify Session
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) sessions.delete(token);
    return res.status(401).json({ authenticated: false, message: 'Session expired' });
  }

  return res.json({ authenticated: true, role: session.role });
});

// API: Login with secure PBKDF2 hashing & session token generation
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Hash input with current salt and compare timing-safely
  const inputHash = crypto
    .pbkdf2Sync(password, adminSalt, 10000, 64, 'sha512')
    .toString('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(inputHash, 'hex'),
    Buffer.from(adminHash, 'hex')
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // Generate cryptographically secure session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionDurationMs = 24 * 60 * 60 * 1000; // 24 hours

  sessions.set(sessionToken, {
    userId: 'admin-lead',
    role: 'admin',
    expiresAt: Date.now() + sessionDurationMs,
  });

  return res.json({
    success: true,
    token: sessionToken,
    role: 'admin',
    expiresIn: sessionDurationMs / 1000,
  });
});

// API: Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  return res.json({ success: true });
});

// API: Update admin password
app.post('/api/auth/update-password', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  adminSalt = crypto.randomBytes(16).toString('hex');
  adminHash = crypto
    .pbkdf2Sync(newPassword, adminSalt, 10000, 64, 'sha512')
    .toString('hex');

  return res.json({ success: true, message: 'Password updated successfully' });
});

// SERVER / VITE INTEGRATION
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
