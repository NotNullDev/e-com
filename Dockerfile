# Production image, copy all the files and run next
FROM node:20-bullseye-slim AS runner
WORKDIR /app

USER root

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY ./.next/standalone ./
COPY ./node_modules ./node_modules/

COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 3000
CMD [ "sh", "./entrypoint.sh" ]
