FROM node:20.10.0-alpine AS deps
WORKDIR /deps
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20.10.0-alpine AS builder
WORKDIR /build
COPY --from=deps /deps/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20.10.0-alpine AS runner
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
USER node
WORKDIR /app
COPY --from=deps /deps/node_modules ./node_modules
COPY --from=builder --chown=node:node /build/dist/src ./
CMD ["node", "--enable-source-maps", "index.js"]