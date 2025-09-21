# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install build tooling and openssl for Prisma engines
RUN apk add --no-cache python3 make g++ openssl

# Dependencies
COPY package*.json ./
RUN npm install

# Prisma generate (needed during build for types)
COPY prisma ./prisma
RUN npx prisma generate

# Source
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# Build
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Runtime deps for Prisma
RUN apk add --no-cache openssl

# Install only production deps and generate Prisma client
COPY package*.json ./
COPY prisma ./prisma
RUN npm install && npx prisma generate

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/main.js"]
