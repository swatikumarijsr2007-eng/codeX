import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://codex:codexpass@localhost:5432/codex_crm?schema=public',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT ?? 'localhost',
  MINIO_PORT: Number(process.env.MINIO_PORT ?? 9000),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY ?? 'codexminio',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY ?? 'codexminio123',
  MINIO_BUCKET: process.env.MINIO_BUCKET ?? 'codex-crm',
};
