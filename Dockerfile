# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Production stage
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy everything from builder (faster than reinstalling)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/dev.db ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./dev.db"

# Start the application
CMD ["bun", "run", "src/index.ts"]
