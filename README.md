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
2. Build docker container `docker compose build`
3. Run project `docker compose up`

### Updating a project on the server

After successfully building the project in GitHub Actions, you need to follow these steps to update the project on the server:

1. Go to the project directory.
2. Download the latest Docker images from Docker Hub `docker compose pull`
3. Restart container in background `docker compose up -d`
