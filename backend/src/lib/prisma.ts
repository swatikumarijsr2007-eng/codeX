import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
process.env.DATABASE_URL ??= 'postgresql://codex:codexpass@localhost:5432/codex_crm?schema=public';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
