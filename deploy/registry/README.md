#### Deploy project

1. Create folder for auth data `mkdir auth`
2. Create credentials file `htpasswd -Bc auth/registry.password spaceman`
3. Enter password when prompted (e.g., toor)
4. Add additional users (if needed) `htpasswd -B auth/registry.password additional_user`
5. Run project `docker compose up`
