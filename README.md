- [Sample online shop](#sample-online-shop)
  - [Dev commands](#dev-commands)
  - [Documentation](#documentation)
  - [Useful tools](#useful-tools)
  - [templates](#templates)

# Sample online shop

> ***Work in progress***.

Made with Next.js, TailwindCSS, Prisma, DaisyUI, TRPC and Stripe.

# Start project in dev mode
```shell
./dev.sh
# you can do following command to have a clean start
./dev-clear.sh && ./dev.sh
```

openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -outform PEM -out private-public.pem

## Documentation
Check the ./docs folder for more information.

## Useful tools
- https://github.com/Red5d/docker-autocompose

## templates
https://raw.githubusercontent.com/technorabilia/portainer-templates/main/lsio/templates/templates-2.0.json

https://raw.githubusercontent.com/Qballjos/portainer_templates/master/Template/template.json

# Search tools

TODO: postgres full text search on products, we don't need to use meilisearch

https://github.com/meilisearch/docs-scraper
https://github.com/algolia/instantsearch


# TODO
- [ ] Deploy to fly.io

# Db setup

```bash
# First run

export DATABASE_URL="postgres://e_com:e_com@nnd-vm-3:5432/e_com?sslmode=disable"
bun drizzle-kit generate --config=drizzle/drizzle.config.ts
bun drizzle-kit push --config=drizzle/drizzle.config.ts
bun run drizzle/seed.ts

# After schema change
export DATABASE_URL="postgres://e_com:e_com@nnd-vm-3:5432/e_com?sslmode=disable"
bun drizzle-kit generate --config=drizzle/drizzle.config.ts
bun drizzle-kit push --config=drizzle/drizzle.config.ts

# SEED
export DATABASE_URL="postgres://e_com:e_com@nnd-vm-3:5432/e_com?sslmode=disable"
bun run drizzle/seed.ts

```
