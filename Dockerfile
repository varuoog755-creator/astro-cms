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

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
