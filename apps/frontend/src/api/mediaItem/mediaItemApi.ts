import type { MediaItemTrackingDataType, MediaItemType } from "@movie-tracker/types";
import type {
  MediaItemCreateApiTypes,
  MediaItemCreateCloneApiTypes,
  MediaItemUpdateApiTypes
} from "~/api/mediaItem/mediaItemApiTypes";
import { api } from "~/api/instance";
import type { RequestOptions } from "@movie-tracker/utils"

export const getMediaItemsApi = async (options?: RequestOptions) => {
  return api.get<MediaItemType[]>("media-item", options);
};

export const getMediaItemsByMediaListIdApi = async (mediaListId: string) => {
  return api.get<MediaItemType[]>(`media-item/media-list/${mediaListId}`);
};

export const createMediaItemApi = async (body: MediaItemCreateApiTypes) => {
  return api.post<MediaItemType>("media-item", body);
};

export const deleteMediaItemApi = async (mediaItemId: string) => {
  return api.delete<MediaItemType>(`media-item/${mediaItemId}`);
};

export const updateMediaItemTrackingDataApi = async (trackingDataId: string, body: MediaItemTrackingDataType) => {
  return api.patch<MediaItemTrackingDataType>(`tracking-data/${trackingDataId}`, body);
};


export const createMediaItemCloneApi = async (args: MediaItemCreateCloneApiTypes) => {
  return api.post<MediaItemType>(`media-item/${args.mediaItemId}/clone`, {
    mediaListId: args.mediaListId,
    isSaveCreationDate: args.isSaveCreationDate
  });
};

export const updateMediaItemApi = async (mediaItemId: string, body: MediaItemUpdateApiTypes) => {
  return api.patch<MediaItemType>(`media-item/${mediaItemId}`, body);
};
