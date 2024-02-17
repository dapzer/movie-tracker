#### [Перейти на развернутую версию](https://movie-tracker.app)

### О проекте

Movie Tracker - это сервис поиска и отслеживания просматриваемых кинокартин.

Главной целью при создании данного проекта была реализация личных списков с фильмами и удобной системой отслеживая текущего прогресса для сериалов. 

В роли базы кинокартин и актёров выступает [The Movie Database API](https://www.themoviedb.org/documentation/api).

### Стек технологий

- Turbo Repo
- TypeScript
- Vue Js
- Nuxt
- TanStacQuery
- Nest Js
- PostgreSQL
- Prisma
- Docker

### Локальное развертывание

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracker.git`
2. Выполните установку npm-пакетов `pnpm install`
3. Запустите проект `pnpm run dev`
4. Перейдите на `http://localhost:3000`

### Запуск в Docker

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracker.git`
2. Выполните сборку docker контейнера `docker compose build`
3. Запустите проект `docker compose up`

### Обновление проекта на сервере

После успешной сборки проекта в GitHub Actions необходимо выполнить следующие шаги для обновления проекта на сервере:

1. Перейдите в директорию с проектом.
2. Загрузите последнюю версию Docker-контейнера из Docker Hub `docker compose pull`
3. Перезапустить контейнер в фоновом режиме `docker compose up -d`
