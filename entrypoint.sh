#!/bin/sh
ls -lah

# if test "$INIT_DB" = "true"; then
#   echo "Initializing database"
#   npx prisma db push
#   npx prisma db seed
# fi

node server.js --hostname 0.0.0.0
# sleep 360000s