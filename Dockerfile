# Trava Aqui · imagem para desenvolvimento (com hot reload) e produção.
# Multiarquitetura: roda em Mac com Apple Silicon (arm64) e em máquinas x86.

FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm@12.16.1
WORKDIR /app

# Dependências, em camada própria para o cache do Docker.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Desenvolvimento: o código entra por volume (docker-compose) e o Next recarrega a cada mudança.
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

FROM deps AS build
COPY . .
RUN pnpm build

# Produção: só o servidor standalone, sem node_modules de desenvolvimento.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
