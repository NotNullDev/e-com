- [Sample online shop](#sample-online-shop)
  - [Dev commands](#dev-commands)
  - [Documentation](#documentation)
  - [Useful tools](#useful-tools)
  - [templates](#templates)

# Sample online shop

> ***Work in progress***.

Made with Next.js, TailwindCSS, Prisma, DaisyUI, TRPC and Stripe.

Bootstrapped with create-t3-app.


## Dev commands

```bash
# run dev containers
docker compose -f ./docker-compose-dev.yml up -d --force-recreate
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

https://github.com/meilisearch/docs-scraper
https://github.com/algolia/instantsearch

```shell
flyctl postgres attach e-com-nnd-db
docker exec -u postgres e-com-db pg_dump -Fc --no-owner --file=/tmp/dbdump.dmp e-com && docker cp e-com-db:/tmp/dbdump.dmp ./dbdump.dmp
docker exec -u postgres ea5925e9851a pg_dump -Fc --no-owner --file=/tmp/dbdump.dmp e_com && docker cp ea5925e9851a:/tmp/dbdump.dmp ./dbdump.dmp
fly ssh -a e-com-nnd-db sftp shell
-- cp ./dbdump.dmp /dbdump.dmp
fly ssh -a e-com-nnd-db console
pg_restore -d e_com --no-owner /dbdump.dmp
pg_restore -h localhost -U e_com_nnd -d e_com_nnd -p 5433 --no-owner /dbdump.dmp
fly proxy 5432  -a e-com-nnd-db
```

# TODO
- [ ] Deploy to fly.io

