#!/bin/sh
ls -lah

if test "$INIT_DB" = "true"; then
  echo "Initializing database"
  npx prisma db push
  npx prisma db seed
fi

yarn start
# sleep 360000s