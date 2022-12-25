#!/bin/sh
env

ls

npx prisma db push
npx prisma db seed

node server.js