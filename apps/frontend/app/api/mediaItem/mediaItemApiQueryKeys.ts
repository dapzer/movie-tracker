export const MediaItemQueryKeys = {
  GET_ALL: "mediaItem/getAll",
  GET_BY_MEDIA_LIST_ID: "mediaItem/getByMediaListId",
  GET_COUNT_BY_MEDIA_LIST_ID: "mediaItem/getCountByMediaListId",
  GET_BY_MEDIA_ID: "mediaItem/getByMediaId",
  CREATE: "mediaItem/create",
  DELETE: "mediaItem/delete",
  UPDATE: "mediaItem/update",
  UPDATE_TRACKING_DATA: "mediaItem/updateTrackingData",
  CREATE_CLONE: "mediaItem/createClone",
  BULK_CREATE: "mediaItem/bulkCreate",
  BULK_DELETE: "mediaItem/bulkDelete",
  BULK_UPDATE_TRACKING_DATA: "trackingData/bulkUpdate",
} as const
