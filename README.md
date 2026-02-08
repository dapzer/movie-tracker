![alt](https://raw.githubusercontent.com/dapzer/movie-tracker/refs/heads/master/apps/frontend/public/ogImageEn.webp)

#### [Production](https://movie-tracker.app)

### About the project

Movie Tracker is a service for searching and tracking movies being watched.

The main goal in the creation of this project was the realization of personal lists with movies and a convenient system of tracking the current progress for series.

[The Movie Database API](https://www.themoviedb.org/documentation/api) acts as a database of movies and actors.

### Technology stack

- Turborepo
- TypeScript
- Vue.js
- Nuxt
- TanStack Query
- Node.js
- NestJS
- Redis
- PostgreSQL
- Prisma
- Docker

### Development

#### Requirements

- [Pnpm](https://pnpm.io/)
- [Node.js (20+)](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/get-docker/)

#### Run project

1. Clone repository `git clone https://github.com/dapzer/movie-tracker.git`
2. Create a `.env` file and transfer the data from `.env.development` into it
3. Run needed services (PostgreSQL, Adminer, Redis) `docker compose -f docker-compose.dev.yml up -d`
4. Install dependencies `pnpm install`
5. Run project `pnpm run dev`

### Running in Docker

1. Clone repository `git clone https://github.com/dapzer/movie-tracker.git`
2. Init swarm `docker swarm init`
3. Set labels for node `docker node update --label-add databases=true <node_id>`, `docker node update --label-add registry=true <node_id>` and `docker node update --label-add 
   reverseproxy=true <node_id>`
4. Create shared networks `docker networkcreate --driver overlay --attachable caddy-public`, `docker network create 
--driver overlay --attachable movie-tracker-metrics`, `docker network create --driver overlay --attachable movie-tracker-shared`
5. Create `.emv` file and transfer the data from `.env.development` into it `cp .env.development .env`
6. Deploy stack `docker stack deploy -c compose.stack.yaml --with-registry-auth movie-tracker`

### Aliases for Docker commands

```bash
function dsu() {
    docker service update --with-registry-auth --force --image danilavoronkov/movie-tracker-$1 movie-tracker_$1
}
function dsl() {
    docker service logs -f --since $1m movie-tracker_$2
}
function deploy() {
    docker stack deploy -c compose.stack.yaml --with-registry-auth $1
}
```

### Updating a project on the server

After successfully building the project in GitHub Actions, you need to follow these steps to update the project on the server:

1. Run `dsu <service_name>` 
