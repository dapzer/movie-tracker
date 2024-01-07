export const AuthQueryKeys = {
  SIGN_IN: "auth/signIn",
  SIGN_IN_CALLBACK: "auth/signInCallback",
  LOGOUT: "auth/logout",
  USER_PROFILE: "auth/userProfile",
} as const

export const  MediaListQueryKeys = {
  GET_ALL: "mediaList/getAll",
  CREATE: "mediaList/create",
  DELETE: "mediaList/delete",
  UPDATE: "mediaList/update",
} as const


export const  MediaItemQueryKeys = {
  GET_ALL: "mediaItem/getAll",
  CREATE: "mediaItem/create",
  DELETE: "mediaItem/delete",
  UPDATE: "mediaItem/update",
} as const
