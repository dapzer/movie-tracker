import type { MediaItemTrackingDataType, MediaItemType } from "@movie-tracker/types";
import type {
  MediaItemCreateApiTypes,
  MediaItemCreateCopyApiTypes,
  MediaItemUpdateApiTypes
} from "~/api/mediaItem/mediaItemApiTypes";
import { api } from "~/api/instance";

export const getMediaItemsApi = async () => {
  return api.get<MediaItemType[]>("mediaItem");
};
export const getMediaItemsByMediaListIdApi = async (mediaListId: string) => {
  return api.get<MediaItemType[]>(`mediaItem/mediaList/${mediaListId}`);
};

export const createMediaItemApi = async (body: MediaItemCreateApiTypes) => {
  return api.post<MediaItemType>("mediaItem", body);
};

export const deleteMediaItemApi = async (mediaItemId: string) => {
  return api.delete<MediaItemType>(`mediaItem/${mediaItemId}`);
};

export const updateMediaItemTrackingDataApi = async (trackingDataId: string, body: MediaItemTrackingDataType) => {
  return api.patch<MediaItemTrackingDataType>(`trackingData/${trackingDataId}`, body);
};


export const createMediaItemCopyApi = async (args: MediaItemCreateCopyApiTypes) => {
  return api.post<MediaItemType>(`mediaItem/${args.mediaItemId}/copy`, {
    mediaListId: args.mediaListId,
    isSaveCreationDate: args.isSaveCreationDate
  });
};

export const updateMediaItemApi = async (mediaItemId: string, body: MediaItemUpdateApiTypes) => {
  return api.patch<MediaItemType>(`mediaItem/${mediaItemId}`, body);
};
