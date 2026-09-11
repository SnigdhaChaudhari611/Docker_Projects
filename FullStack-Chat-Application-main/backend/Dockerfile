FROM dhi.io/node:24-alpine3.23-dev AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .


FROM dhi.io/node:24-alpine3.23 AS runner

WORKDIR /app

# Ensures we run as a non-root user for security
USER node

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "src/index.js"]

