import { PrismaClient } from '@prisma/client';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const DEFAULT_DIRECT_URL =
  'postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = DEFAULT_DIRECT_URL;
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

globalThis.prismaGlobal = prisma;

export default prisma;
