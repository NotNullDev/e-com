FROM --platform=linux/amd64 node:16-bullseye AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY ./.next/standalone .

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]