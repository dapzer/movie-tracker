#### [Перейти на развернутую версию](https://movie-tracker.dapzer.ru)

### О проекте

Movie Tracker - это сервис поиска и отслеживания просматриваемых кинокартин.

Главной целью при создании данного проекта была реализация списка избранного. Для решения этой задачи я
использовал: [NextAuth.Js](https://next-auth.js.org/) - для авторизаций пользователей, [mongodb](https://www.mongodb.com/) -
для хранения данных о пользователях и их списка избранного
и [nextjs-api](https://nextjs.org/docs/api-routes/response-helpers) - для выполнения запросов к базе данных.

В роли базы кинокартин и актёров выступает [The Movie Database API](https://www.themoviedb.org/documentation/api).

### Стек технологий

- React Js
- Next Js
- NextAuth.Js
- React Query
- TypeScript
- Scss Modules
- Mongo DB

### Локальное развертывание

1. Склонируйте данный репозиторий `git pull https://github.com/dapzer/movie-tracket.git`
2. Выполните установку npm-пакетов `npm install`
3. Запустите проект `npm run dev`
4. Перейдите на `http://localhost:3000`
