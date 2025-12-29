FROM node:25-alpine3.22 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:25-alpine3.22 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NOTE:
# - NEXT_PUBLIC_API_URL is a build-time configuration for Next.js.
# - Its value is baked into the client-side bundle during `npm run build`.
# - Changing NEXT_PUBLIC_API_URL at runtime (e.g. via docker-compose/compose.yaml)
#   will ONLY affect the server-side Node environment, not the already-built bundle.
# - To change the client-side API URL, rebuild the image with a different build arg:
#     docker build --build-arg NEXT_PUBLIC_API_URL=... .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:25-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
ENV PORT 3001
CMD ["node", "server.js"]