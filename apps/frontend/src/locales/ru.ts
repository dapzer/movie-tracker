export default {
  auth: {
    signIn: 'Войти',
    signOut: 'Выйти',
    authInProgress: 'Выполняется авторизация',
    authError: 'Произошла ошибка при авторизации',
    authErrorHint: 'Выберите другой способ авторизации или попробуйте авторизоваться позже',
    login: 'Вход',
    closeLoginWindow: 'Закрыть окно авторизации',
    email: 'Почта',
    emailPlaceholder: 'Введите почту',
    password: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    repeatPassword: 'Повторите пароль',
    repeatPasswordPlaceholder: 'Введите пароль еще раз',
    name: 'Имя',
    namePlaceholder: 'Введите имя',
    haveNoAccount: 'Нет аккаунта?',
    image: 'Фото профиля',
    imagePlaceholder: 'Вставьте ссылку на изображение или gif',
    signUp: 'Зарегистрироваться',
    createAccount: 'Создание аккаунта',
    recoverPassword: 'Восстановить пароль',
    passwordRecovery: 'Восстановление пароля',
    resetPassword: 'Сбросить пароль',
    resetPasswordProcess: 'Сброс пароля',
    passwordRecoverySuccess: 'На ваш адрес электронной почты было отправлено письмо с инструкциями о том, как сбросить пароль. Если вы не получите его в течение нескольких минут, убедитесь, что вы указали адрес электронной почты для своей учётной записи, и повторите попытку или обратитесь к нам за помощью.',
    emailNotVerified: 'Почта не подтверждена',
    emailVerified: 'Почта подтверждена',
    verifyEmail: 'Подтвердить почту',
    emailSuccessfullyVerified: 'Почта успешно подтверждена',
    emailSuccessfullyChanged: 'Почта успешно изменена',
    errors: {
      'Email or password not valid': 'Неверная почта или пароль',
      'User already exists': 'Пользователь с такой почтой уже существует',
      'User not found': 'Пользователь не найден',
      'ThrottlerException: Too Many Requests': 'Слишком много запросов, попробуйте позже',
      'Failed to send an email': 'Не удалось отправить письмо, попробуйте позже или обратитесь к администратору',
      'Invalid token': 'Неверный токен',
      'Bad Request Exception': 'Некорректный запрос',
      "Unknown error": "Неизвестная ошибка",
      "Unauthorized": "Не авторизован",
      passwordTooWeak: 'Пароль должен содержать как минимум 1 цифру или 1 специальный символ',
      passwordNotValid: 'Пароль должен содержать от 8 до 32 символов',
      emailNotValid: 'Некорректный формат почты',
      nameInvalid: 'Имя должно содержать от 1 до 32 символов',
      passwordNotMatch: 'Пароли не совпадают',
      emailConfirmation: 'Произошла ошибка при подтверждении почты',
      emailChanging: 'Произошла ошибка при изменении почты',
    },
  },
  dashboard: {
    title: 'Панель управления',
    dataGeneration: 'Генерация данных',
    dataSummary: 'Сводка данных',
    generateSitemap: 'Запустить генерацию карты сайта',
    sitemapGenerationStarted: 'Генерация карты сайта запущена',
    sitemapGenerationFinished: 'Генерация карты сайта завершена',
    generateDetails: 'Начать генерацию информации по медиа',
    detailsGenerationStarted: 'Генерация информации по медиа запущена',
    detailsGenerationFinished: 'Генерация информации по медиа завершена',
  },
  details: {
    releaseDate: 'Дата выхода',
    userScore: 'Оценка пользователей',
    productionCountry: 'Страна производства',
    producer: 'Режиссёр',
    creator: 'Создатель(и)',
    productionCompanies: 'Кинокомпании',
    genre: 'Жанр',
    budget: 'Бюджет',
    revenue: 'Сборы',
    lastAirDate: 'Дата выхода последнего эпизода',
    nextAirDate: 'Дата выхода следующего эпизода',
    seriesStatus: 'Статус сериала',
    seasonsCount: 'Количество сезонов',
    episodesCount: 'Количество серий',
    episodeRunTime: 'Длительность серий',
    runTime: 'Длительность',
    runTimeMins: 'мин.',
    movieDescription: 'Описание фильма',
    tvDescription: 'Описание сериала',
    personDescription: 'Биография',
    videosTitle: 'Видеоматериалы',
    castTitle: 'Актеры',
    recommendationsTitle: 'Похожие кинокартины',
    inNumberOfEpisodes: 'В {episodes} эпизодах',
    role: 'Роль(и)',
    episodesList: 'Список эпизодов',
    listOfEpisodes: 'Список эпизодов сериала',
    totalViewingTime: 'Общее время просмотра',
    episodeNumber: 'Номер эпизода',
    episodeDuration: 'Продолжительность эпизода',
    episodeDescription: 'Описание эпизода',
    birthday: 'Дата рождения',
    deathday: 'Дата смерти',
    placeOfBirth: 'Место рождения',
    fameFor: 'Известность за',
    alsoKnownAs: 'Также известно как',
    biography: 'Биография',
    filmography: 'Фильмография',
    socialNetworks: 'Социальные сети',
    seriesStatusName: {
      'canceled': 'Отменён',
      'ended': 'Завершён',
      'returning series': 'В производстве',
      'in production': 'В производстве',
    },
    mediaType: {
      movie: 'Фильм',
      tv: 'Сериал',
      person: 'Персона',
    },
  },
  hero: {
    title: 'Добро пожаловать в мир кино и сериалов!',
    aboutService: 'Movie Tracker - это универсальный сервис для любителей кино и сериалов. Здесь вы можете легко находить фильмы, сериалы и актеров, а также создавать свои списки, которыми можно делиться с друзьями по ссылке. В списках вы можете отслеживать текущую серию и сезон, менять статусы кинокартин и делиться своими впечатлениями о просмотренных произведениях.',

    social: {
      title: 'Социальные сети',
      telegramWithProjectNews: 'Телеграм с новостями проекта',
      telegramForCommunicationAndDiscussion: 'Телеграм для общения и обсуждения фильмов',
    },
  },
  mediaItem: {
    addedDate: 'Дата добавления',
    management: 'Управление',
    removeFromList: 'Удалить из списка',
    createClone: {
      button: 'Клонировать в другие списки',
      title: 'Клонирование кинокартины',
      description: 'Выберите списки, в которые необходимо клонировать «{title}»',
      isSaveCreationDate: 'Клонировать с текущей датой добавления',
      noAvailableLists: 'Нет доступных списков.',
      clone: 'Клонировать',
      successfullyCreated: 'Кинокартина успешно клонирована в выбранные списки',
    },
    changeMediaList: {
      button: 'Изменить список',
      title: 'Изменение списка',
      description: 'Выберите список, в который необходимо переместить «{title}»',
      noAvailableLists: 'Нет доступных списков.',
      change: 'Переместить',
      successfullyChanged: 'Кинокартина успешно перемещена в выбранный список',
    },
    trackingMenu: {
      title: 'Меню отслеживания',
      siteToView: 'Cайт для просмотра',
      addSiteToView: 'Добавить сайт для просмотра',
      currentEpisode: 'Текущий эпизод',
      currentSeason: 'Текущий сезон',
      tabs: {
        information: 'Информация',
        note: 'Заметка',
      },
    },
    status: {
      VIEWED: 'Просмотрено',
      WATCHING_NOW: 'Смотрю сейчас',
      NOT_VIEWED: 'Буду смотреть',
      WAIT_NEW_PART: 'Ожидается новая часть',
    },
  },
  mediaList: {
    addToList: 'Добавить в список',
    unauthorizedDescription: 'для отображения ваших списков',
    unauthorizedTitle: 'Войдите',
    yourLists: 'Ваши списки',
    yourList: 'Ваш список «{title}»',
    userList: 'Список «{title}»',
    empty: 'Данный список пуст',
    private: 'Данный список является приватным',
    favorites: 'Избранное',
    confirmDeleteTitle: 'Вы уверены, что хотите удалить список «{title}»?',
    confirmDeleteDescription: 'Вы не сможете восстановить этот список и всё его содержимое.',
    create: 'Создать список',
    createNew: 'Создать новый список',
    errors: {
      titleLength: 'Минимальная длина названия 3 символа',
    },
    createClone: {
      title: 'Клонировать список',
      description: 'Выберите кинокартины с каким статусом вы хотите клонировать',
      keepStatus: 'Сохранить текущий статус',
      submit: 'Клонировать',
      success: 'Список успешно клонирован',
    },
    settingsForm: {
      title: 'Название списка',
      titlePlaceholder: 'Введите название',
      poster: 'Постер',
      posterPlaceholder: 'Вставьте ссылку на изображение или gif',
      publicStatus: 'Просмотр по публичному URL',
    },
    sort: {
      title: 'Сортировка',
      createdAtAsc: '▲ Дата добавления',
      createdAtDesc: '▼ Дата добавления',
      updatedAtAsc: '▲ Последнее обновление',
      updatedAtDesc: '▼ Последнее обновление',
    },
  },
  navigation: {
    home: 'Поиск',
    lists: 'Мои списки',
    userSettings: 'Настройки пользователя',
    accountSettings: 'Настройки аккаунта',
  },
  search: {
    title: 'Найти фильм, сериал, персону...',
    placeholder: 'Поиск',
    totalResults: 'Найдено результатов',
    notingFound: 'Ничего не найдено',
    mediaPlaceholder: 'Введите название кинокартины',
  },
  seo: {
    title: 'Movie Tracker - ваш незаменимый помощник в мире кино и сериалов',
    description: 'Здесь вы можете легко находить фильмы, сериалы и актеров, а также создавать свои списки, которыми можно делиться с друзьями по ссылке.',
    keywords: 'фильм фильмы поиск кино обои афиша обзоры сегодня в кино скоро кассовые сборы кинотеатры актер актеры актриса режиссер сценарист фото фотография постер отслеживание списки трекинг',
  },
  toasts: {
    mediaItem: {
      successAddedToList: '{media} добавлен в список «{listName}»',
      successRemovedFromList: '{media} удален из списка «{listName}»',
      successRemovedFromCurrentList: '{media} удален из текущего списка',
      successSiteToViewChanged: 'Список сайтов для просмотра успешно обновлен',
      successNoteChanged: 'Заметка успешно обновлена',
      successStatusChanged: 'Статус успешно изменен',
    },
    mediaList: {
      successCreated: 'Список успешно создан',
      successUpdated: 'Список успешно обновлен',
      successDeleted: 'Список успешно удален',
    },
    user: {
      profileUpdated: 'Профиль успешно обновлен',
      confirmationEmailSent: 'Письмо для подтверждения почты успешно отправлено',
      newEmailConfirmationEmailSent: 'Проверьте свой новый адрес электронной почты для подтверждения',
      requestEmailConfirmation: 'Произошла ошибка при запросе подтверждения почты',
    },
  },
  ui: {
    loading: 'Загрузка',
    popularMovies: 'Популярные фильмы',
    popularTv: 'Популярные сериалы',
    detailed: 'Подробнее',
    fullList: 'Полный список',
    settings: 'Настройки',
    confirmAction: 'Подтвердите действие',
    yes: 'Да',
    no: 'Нет',
    or: 'Или',
    characters: 'Символы',
    emailSent: 'Письмо отправлено',
    errors: {
      pageNotFound: 'Страница не найдена.',
    },
    actions: {
      create: 'Создать',
      save: 'Сохранить',
      cancel: 'Отменить',
      backToMainPage: 'Вернуться на главную',
      continue: 'Продолжить',
    },
    pagination: {
      toStart: 'В начало',
      toEnd: 'В конец',
    },
    time: {
      shortDay: 'д.',
      shortHour: 'ч.',
      shortMin: 'м.',
    },
  },
  errors: {
    required: 'Поле обязательно для заполнения',
    urlNotValid: 'Некорректная ссылка',
  },
};
