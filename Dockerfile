FROM node:22-alpine AS builder
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps

ENV DATABASE_URL="postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
ENV DIRECT_URL="postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_URL="postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
ENV DIRECT_URL="postgresql://postgres.ypivtgzaibdoyinlxnvo:TeepulDb%402026SecurePass%21@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev --legacy-peer-deps
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
EXPOSE 4321
CMD ["sh", "-c", "npx prisma db push --skip-generate || true; node ./dist/server/entry.mjs"]
