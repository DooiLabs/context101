# ----- Build Stage -----
FROM node:lts-alpine AS builder
RUN corepack enable pnpm
WORKDIR /app

# Copy monorepo config and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/mcp-deprecated ./packages/mcp-deprecated
RUN pnpm install --frozen-lockfile

# Build the mcp package
RUN pnpm --filter @upstash/context7-mcp build

# ----- Production Stage -----
FROM node:lts-alpine
RUN corepack enable pnpm
WORKDIR /app

# Install production dependencies only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/mcp-deprecated/package.json ./packages/mcp-deprecated/
RUN pnpm install --frozen-lockfile --prod --filter @upstash/context7-mcp

# Copy built files from builder
COPY --from=builder /app/packages/mcp-deprecated/dist ./packages/mcp-deprecated/dist

WORKDIR /app/packages/mcp-deprecated
EXPOSE 8080
CMD ["node", "dist/index.js", "--transport", "http", "--port", "8080"]
