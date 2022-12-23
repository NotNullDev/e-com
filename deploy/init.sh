#! /bin/bash
docker compose -f docker-compose-dev.yml up -d
yarn
npm i -g ts-node
prisma db push
prisma db seed