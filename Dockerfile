# Build
FROM node:22-alpine AS construcao
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime — só o .output, sem node_modules de build
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NITRO_PORT=3000 NITRO_HOST=0.0.0.0
COPY --from=construcao /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
