export const AuthQueryKeys = {
  SIGN_IN: "auth/signIn",
  SIGN_IN_CALLBACK: "auth/signInCallback",
  LOGOUT: "auth/logout",
  USER_PROFILE: "auth/userProfile"
} as const;

export const MediaListQueryKeys = {
  GET_ALL: "mediaList/getAll",
  GET_BY_ID: "mediaList/getById",
  CREATE: "mediaList/create",
  DELETE: "mediaList/delete",
  UPDATE: "mediaList/update"
} as const;


export const MediaItemQueryKeys = {
  GET_ALL: "mediaItem/getAll",
  GET_BY_MEDIA_LIST_ID: "mediaItem/getByMediaListId",
  CREATE: "mediaItem/create",
  DELETE: "mediaItem/delete",
  UPDATE: "mediaItem/update",
  UPDATE_TRACKING_DATA: "mediaItem/updateTrackingData",
  CREATE_COPY: "mediaItem/createCopy"
} as const;

export const SitemapQueryKeys = {
  GENERATE: "sitemap/generate"
} as const;

export const DetailsQueryKeys = {
  INITIALIZE: "details/initialize"
}

export const AnalyticsQueryKeys = {
  GET_RECORDS: "analytics/getRecords"
}
