# ==============================================================================
# Septer CNAPP Website - Frontend Marketing & Admin Showcase Web Service
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
COPY .output ./.output
COPY public ./public

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 8080) + '/', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["node", ".output/server/index.mjs"]
