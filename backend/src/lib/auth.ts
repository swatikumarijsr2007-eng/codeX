import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name: string;
  username?: string;
};

export function signToken(user: AuthUser) {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthUser;
}
