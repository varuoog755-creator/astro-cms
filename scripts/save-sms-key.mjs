import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const apiKey = 'JKqErnfVoATGhbYB0yzvlFOPxUkMHm5XtL3N8Q91Da6e7Rsj24Sg5m4oXfkYExLbjt71Dh0wWJOcreMR';
  const result = await prisma.setting.upsert({
    where: { key: 'fast2sms_api_key' },
    update: { value: apiKey, group: 'sms' },
    create: { key: 'fast2sms_api_key', value: apiKey, group: 'sms' },
  });

  await prisma.setting.upsert({
    where: { key: 'sms_gateway_provider' },
    update: { value: 'fast2sms', group: 'sms' },
    create: { key: 'sms_gateway_provider', value: 'fast2sms', group: 'sms' },
  });

  await prisma.setting.upsert({
    where: { key: 'sms_otp_dispatch_enabled' },
    update: { value: 'false', group: 'sms' },
    create: { key: 'sms_otp_dispatch_enabled', value: 'false', group: 'sms' },
  });

  console.log('Saved settings successfully: fast2sms_api_key, sms_otp_dispatch_enabled=false');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
