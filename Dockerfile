# Nou Art — SvelteKit (adapter-node) + better-sqlite3
# Multi-stage: compile native deps in the build stage, ship a slim runtime.

FROM node:22-slim AS build
WORKDIR /app
# Build tools for better-sqlite3's native addon.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build \
	&& npm prune --omit=dev

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
# Persistent data (SQLite + uploads) lives here — mount a volume on /data.
RUN mkdir -p /data && chown -R node:node /data
VOLUME /data
USER node
EXPOSE 3000
CMD ["node", "build/index.js"]
