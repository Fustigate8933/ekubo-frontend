# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output /app/.output
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

