# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g corepack@latest \
  && corepack enable \
  && corepack prepare pnpm@11.1.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

ENV PORT=3001

RUN npm install -g corepack@latest \
  && corepack enable \
  && corepack prepare pnpm@11.1.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["pnpm", "start"]
