FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_URL="file:./cms.db"

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate
RUN npx prisma db push
RUN node --import tsx prisma/seed.ts || true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
