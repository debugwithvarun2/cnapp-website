# ==============================================================================
# Septer CNAPP Website - Backend API Service Dockerfile
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests and tsconfig
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy sources and data
COPY src ./src
COPY data ./data

# Compile TypeScript to JavaScript
RUN npm run build

# ------------------------------------------------------------------------------
# Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5005

# Unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5005

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 5005) + '/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/server.js"]
