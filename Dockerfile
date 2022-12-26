# Install dependencies only when needed
FROM node:18.12.1-alpine AS node_modules
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM node:18.12.1-bullseye AS builder

WORKDIR /app

COPY . .
COPY --from=node_modules /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1

ARG NODE_ENV=production
ENV NODE_ENV=production

ARG DATABASE_URL=$DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ARG NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

ARG GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

ARG GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

ARG POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD

ARG POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_DB=$POSTGRES_DB

ARG INIT_DB=$INIT_DB
ENV INIT_DB=$INIT_DB

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ARG STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

ARG GCLOUD_BUCKET_NAME=$GCLOUD_BUCKET_NAME
ENV GCLOUD_BUCKET_NAME=$GCLOUD_BUCKET_NAME

ENV NEXT_PUBLIC_IMAGE_SERVER_URL=$NEXT_PUBLIC_IMAGE_SERVER_URL
ARG NEXT_PUBLIC_IMAGE_SERVER_URL=$NEXT_PUBLIC_IMAGE_SERVER_URL

ARG IMAGE_URL_PREFIX=$IMAGE_URL_PREFIX
ENV IMAGE_URL_PREFIX=$IMAGE_URL_PREFIX

ARG GCLOUD_PROJECT_ID=$GCLOUD_PROJECT_ID
ENV GCLOUD_PROJECT_ID=$GCLOUD_PROJECT_ID

ARG GCLOUD_API_KEY=$GCLOUD_API_KEY
ENV GCLOUD_API_KEY=$GCLOUD_API_KEY

RUN yarn postinstall
RUN yarn build
# If using npm comment out above and use below instead
# RUN npm run build

# # Production image, copy all the files and run next
# FROM node:18.12.1-alpine3.16 AS runner
# WORKDIR /app

# USER root

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1
# ENV PORT 3000

# COPY --from=builder /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder  /app/.next/standalone ./
# COPY --from=builder  /app/.next/static ./.next/static

# COPY --from=builder  /app/prisma /app/prisma
# COPY --from=builder  /app/entrypoint.sh /app/entrypoint.sh

EXPOSE 3000

ENV NODE_ENV production
CMD [ "sh", "./entrypoint.sh" ]