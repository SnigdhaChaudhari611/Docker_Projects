FROM dhi.io/node:24-alpine3.23-dev AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


FROM dhi.io/node:24-alpine3.23 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY server.js .

EXPOSE 5173

CMD ["node", "server.js"]
