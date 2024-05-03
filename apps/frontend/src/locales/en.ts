export default  {
  auth:{
    signIn: "Sign in",
    signOut: "Sign out",
    authInProgress: "Authorization in progress",
    authError: "An error occurred during authorization",
    authErrorHint: "Choose a different login method or try logging in later",
    login: "Login",
    closeLoginWindow: "Close the authorization window",
  },
  dashboard: {
    title: "Dashboard",
    dataGeneration: "Data generation",
    dataSummary: "Data summary",
    generateSitemap: "Start sitemap generation",
    sitemapGenerationStarted: "Sitemap generation started",
    sitemapGenerationFinished: "Sitemap generation finished",
    generateDetails: "Start details generation",
    detailsGenerationStarted: "Details generation started",
    detailsGenerationFinished: "Details generation finished",
  },
  details: {
    releaseDate: 'Release date',
    userScore: 'User score',
    productionCountry: 'Production country',
    producer: 'Producer',
    creator: 'Creator',
    productionCompanies: 'Production companies',
    genre: 'Genre',
    budget: 'Budget',
    revenue: 'Revenue',
    lastAirDate: 'Release date of last episode',
    nextAirDate: 'Release date for next episode',
    seriesStatus: 'Series status',
    seasonsCount: 'Seasons count',
    episodesCount: 'Episodes count',
    episodeRunTime: 'Episode run time',
    runTime: 'Run time',
    runTimeMins: 'min.',
    movieDescription: 'Movie description',
    tvDescription: 'Series description',
    personDescription: 'Biography',
    videosTitle: 'Videos',
    castTitle: 'Actors',
    recommendationsTitle: 'Similar films',
    inNumberOfEpisodes: 'In {episodes} episodes',
    role: 'Role(s)',
    episodesList: 'List of episodes',
    listOfEpisodes: 'List of episodes of the series',
    totalViewingTime: 'Total viewing time',
    episodeNumber: 'Episode number',
    episodeDuration: 'Episode duration',
    episodeDescription: 'Episode description',
    birthday: 'Birthday',
    deathday: 'Deathday',
    placeOfBirth: 'Place of birth',
    fameFor: 'Fame for',
    alsoKnownAs: 'Also known as',
    biography: 'Biography',
    filmography: 'Filmography',
    socialNetworks: 'Social networks',
    seriesStatusName: {
      "canceled": "Canceled",
      "ended": "Ended",
      "returning series": "Returning series",
      "in production": "In production"
    },
    mediaType: {
      movie: 'Movie',
      tv: 'Series',
      person: 'Person',
    }
  },
  hero: {
    title: "Welcome to the world of cinema and TV series!",
    aboutService: "Movie Tracker is a universal service for movie and TV series lovers. Here you can easily find films, TV series and actors, and also create your own lists, which you can share with friends via a link. In the lists you can track the current series and season, change the status of films and share your impressions of the works you watched.",

    social: {
      title: "Social",
      telegramWithProjectNews: "Telegram with project news",
      telegramForCommunicationAndDiscussion: "Telegram for communication and discussion of films"
    }
  },
  mediaItem: {
    addedDate: "Added Date",
    management: "Management",
    removeFromList: "Remove from list",
    createClone: {
      button: "Copy to other lists",
      title: "Making a clone",
      description: "Specify the lists to clone to «{title}»",
      isSaveCreationDate: "Clone with current date added",
      noAvailableLists: "No lists available.",
      clone: "Clone",
      successfullyCreated: "The movie has been successfully cloned to the selected lists",
    },
    changeMediaList: {
      button: "Change list",
      title: "Change list",
      description: "Select the list to which you want to move «{title}»",
      noAvailableLists: "No lists available.",
      change: "Change",
      successfullyChanged: "The movie has been successfully moved to the selected list",
    },
    trackingMenu: {
      title: "Tracking menu",
      siteToView: "Site to view",
      addSiteToView: "Add site to view",
      currentEpisode: "Current episode",
      currentSeason: "Current season",
      tabs: {
        information: "Information",
        note: "Note",
      }
    },
    status: {
      VIEWED: "Viewed",
      WATCHING_NOW: "Watching now",
      NOT_VIEWED: "Will watch",
      WAIT_NEW_PART: "New part expected",
    }
  },
  mediaList: {
    addToList: "Add to list",
    unauthorizedDescription: "to display your lists",
    unauthorizedTitle: "Sign in",
    yourLists: "Your lists",
    yourList: "Your list «{title}»",
    userList: "List «{title}»",
    favorites: "Favorites",
    empty: "This list is empty",
    private: "This list is private",
    confirmDeleteTitle: "Are you sure you want to delete the list «{title}»?",
    confirmDeleteDescription: "You will not be able to restore this list and all its contents.",
    create: "Create list",
    createNew: "Create new list",
    errors: {
      titleLength: "Минимальная длина названия 3 символа",
    },
    createClone: {
      title: "Clone list",
      description: "Select movies with a certain status you want to clone",
      keepStatus: "Keep current status",
      submit: "Clone",
      success: "List successfully cloned",
    },
    settingsForm: {
      title: "List name",
      titlePlaceholder: "Enter the name",
      poster: "Poster URL",
      posterPlaceholder: "Insert a link to an image or gif",
      publicStatus: "View by public URL",
    },
    sort: {
      title: "Sorting",
      createdAtAsc: "▲ Date added",
      createdAtDesc: "▼ Date added",
      updatedAtAsc: "▲ Last update",
      updatedAtDesc: "▼ Last update",
    }
  },
  navigation: {
    home: "Search",
    lists: "My lists",
  },
  search: {
    title: 'Find a movie, series, person...',
    placeholder: 'Search',
    totalResults: 'Total results',
    notingFound: 'Nothing found',
    mediaPlaceholder: 'Enter the title of the film',
  },
  seo: {
    title: "Movie Tracker - your indispensable assistant in the world of movies and TV series",
    description: "Here you can easily find films, TV series and actors, and also create your own lists that you can share with friends using the link.",
    keywords: "movie movies search film film poster reviews today in movies soon box office movie theaters actor actress director writer photo poster tracking listings tracking"
  },
  toasts: {
    mediaItem: {
      successAddedToList: "{media} added to the list «{listName}»",
      successRemovedFromList: "{media} removed from the list «{listName}»",
      successRemovedFromCurrentList: "{media} removed from the current list",
      successSiteToViewChanged: "The list of sites to view has been successfully updated",
      successNoteChanged: "Note updated successfully",
      successStatusChanged: "Status changed successfully",
    },
    mediaList: {
      successCreated: "List created successfully",
      successUpdated: "List updated successfully",
      successDeleted: "List deleted successfully",
    }
  },
  ui: {
    loading: "Loading",
    popularMovies: "Popular movies",
    popularTv: "Popular TV shows",
    detailed: "Details",
    fullList: "Full list",
    settings: "Settings",
    confirmAction: "Confirm action",
    yes: "Yes",
    no: "No",
    characters: "Characters",
    errors: {
      pageNotFound: "Page not found.",
    },
    actions: {
      create: "Create",
      save: "Save",
      cancel: "Cancel",
      backToMainPage: "Back to main page",
    },
    pagination: {
      toStart: "Begin",
      toEnd: "End"
    },
    time: {
      shortDay: "d.",
      shortHour: "h.",
      shortMin: "m.",
    }
  }
}