# Web Frontend Dockerfile (Next.js + Prisma)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install deps
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client (needs schema)
COPY prisma ./prisma
RUN npx prisma generate

# Build Next.js
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js build
RUN npx next build

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose Next.js port
ENV PORT=3002
EXPOSE 3002

# Start Next.js
CMD ["npx", "next", "start", "-p", "3002"]