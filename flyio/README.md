postgres flyio config file (in order to scale to 0 on idle)

https://fly.io/docs/postgres/managing/scale-to-zero/

```bash
fly config save --app e-com-db
fly image show --app e-com-db
fly deploy . --image flyio/postgres-flex:15.3

fly proxy 5432  -a e-com-db


```

# forking (to resize disk size from 10gb to 1gb)
