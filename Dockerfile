# Install dependencies only when needed
FROM node:18.12.1-alpine AS node_modules
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

COPY package.json ./
RUN corepack enable
RUN pnpm i

FROM node:18.12.1-bullseye AS builder

WORKDIR /app

COPY . .
COPY --from=node_modules /app/node_modules ./node_modules

ARG NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED 1

# in a CI / CD  .env file will be mounted as a volume
# in a local environment, the .env file will be copied
# the better soultion may be fetching the .env file from a secret manager, passing credentials as buildarg
# RUN ls /var/run/envs/nextjs.env \
#     && cat /var/run/envs/nextjs.env > ./.env \
#     || echo "No env file found, skipping loading" # if no env file is found, the build will continue without it
RUN corepack enable
RUN pnpm postinstall
RUN pnpm build

# Production image, copy all the files and run next
FROM node:18.12.1-alpine3.16 AS runner
WORKDIR /app

USER root

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

COPY --from=builder  /app/prisma /app/prisma
COPY --from=builder  /app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder  /app/.env /app/.env


EXPOSE 3000
CMD [ "sh", "./entrypoint.sh" ]
