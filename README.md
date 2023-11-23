#### [Перейти на развернутую версию](https://movie-tracker.dapzer.ru)

### О проекте

Movie Tracker - это сервис поиска и отслеживания просматриваемых кинокартин.

Главной целью при создании данного проекта была реализация списка избранного. Для решения этой задачи я
использовал: [NextAuth.Js](https://next-auth.js.org/) - для авторизаций
пользователей, [mongodb](https://www.mongodb.com/) -
для хранения данных о пользователях и их списка избранного
и [nextjs-api](https://nextjs.org/docs/api-routes/response-helpers) - для выполнения запросов к базе данных.

В роли базы кинокартин и актёров выступает [The Movie Database API](https://www.themoviedb.org/documentation/api).

### Стек технологий

- React Js
- Next Js
- Redux Toolkit
- NextAuth.Js
- React Query
- TypeScript
- Scss Modules
- Mongo DB
- Prisma
- Docker

### Локальное развертывание

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracker.git`
2. Выполните установку npm-пакетов `npm install`
3. Запустите проект `npm run dev`
4. Перейдите на `http://localhost:3000`

### Запуск в Docker

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracket.git`
2. Выполните сборку docker контейнера `docker compose build --build-arg DOPPLER_TOKEN="YOUR_TOKEN"`
3. Запустите проект `docker compose up`

### Обновление проекта на сервере

После успешной сборки проекта в GitHub Actions необходимо выполнить следующие шаги для обновления проекта на сервере:

1. Перейдите в директорию с проектом.
2. Загрузите последнюю версию Docker-контейнера из Docker Hub `docker compose pull`
3. Перезапустить контейнер в фоновом режиме `docker compose up -d`

### F.A.Q

Q: Во время использования локальной версий сайта выдаёт
ошибку ```An error occurred while getting data from TMDB. Code: undefined```?

A: Данная ошибка возникает из-за санкций со стороны TMDB, для решения данной проблемы запустите VPN/Proxy на своём
устройстве и перезапустите проект.
