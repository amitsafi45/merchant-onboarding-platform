
# ---------- Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build API and risk review worker
RUN pnpm exec nest build merchant-onboarding-platform \
    && pnpm exec nest build risk-review-worker


# ---------- Production ----------
FROM node:22-alpine AS prod

WORKDIR /app

RUN npm install -g pnpm@10

# Copy application build output and runtime dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json


CMD ["node", "dist/apps/merchant-onboarding-platform/main.js"]
