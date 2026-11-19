# ==============================================================================
# Production Dockerfile for Septer CNAPP Marketing & Admin Portal
# ==============================================================================
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Create unprivileged user group and user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application output, assets, and persistent data storage
COPY package.json ./
COPY .output ./.output
COPY data ./data

# Set proper ownership for persistent volume data storage
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose HTTP port
EXPOSE 8080

# Health check to ensure SSR and backend API routes are responding
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 8080) + '/api/admin/stats', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the standalone Nitro server
CMD ["node", ".output/server/index.mjs"]
