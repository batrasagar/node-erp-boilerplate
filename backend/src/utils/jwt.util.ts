import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../config/redis';

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
  isSuperAdmin: boolean;
}

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_TOKEN_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const generateAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

export const generateRefreshToken = (): string => uuidv4();

export const storeRefreshToken = async (
  userId: string,
  tenantId: string,
  refreshToken: string,
): Promise<void> => {
  const key = `refresh:${tenantId}:${userId}`;
  await redisClient.setEx(key, REFRESH_TOKEN_EXPIRES_SECONDS, refreshToken);
};

export const getStoredRefreshToken = async (
  userId: string,
  tenantId: string,
): Promise<string | null> => {
  const key = `refresh:${tenantId}:${userId}`;
  return redisClient.get(key);
};

export const revokeRefreshToken = async (userId: string, tenantId: string): Promise<void> => {
  const key = `refresh:${tenantId}:${userId}`;
  await redisClient.del(key);
};

export const generateEmailVerificationToken = (): string => uuidv4();

export const generatePasswordResetToken = (): string => uuidv4();
