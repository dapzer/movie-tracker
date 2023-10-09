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

### Локальное развертывание

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracker.git`
2. Выполните установку npm-пакетов `npm install`
3. Запустите проект `npm run dev`
4. Перейдите на `http://localhost:3000`

### Запуск в Docoker

1. Склонируйте данный репозиторий `git clone https://github.com/dapzer/movie-tracket.git`
2. Выполните сборку docker контейнера `docker compose build --build-arg DOPPLER_TOKEN="YOUR_TOKEN"`
3. Запустите проект `docker compose up`

## Обновление сайта на сервере

После успешной сборки проекта в GitHub Actions и пуша обновлённого контейнера на ваш сервер, вам нужно выполнить следующие шаги для обновления сайта:

1. Зайдите на ваш сервер, используя SSH или другой способ доступа к командной строке.
2. Перейдите в директорию, где находится ваш проект Movie Tracker.
3. Выполните команду `docker compose pull` для загрузки последней версии Docker-контейнера из Docker Hub.
4. Затем выполните команду `docker compose up -d`, чтобы перезапустить контейнер в фоновом режиме. Это обновит ваш сайт с новой версией.

### F.A.Q

Q: Во время использования локальной версий сайта выдаёт
ошибку ```An error occurred while getting data from TMDB. Code: undefined```?

A: Данная ошибка возникает из-за санкций со стороны TMDB, для решения данной проблемы запустите VPN/Proxy на своём
устройстве и перезапустите проект.
