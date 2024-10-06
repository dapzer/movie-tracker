import type { MediaListType } from "@movie-tracker/types";
import type { MediaListCreateCloneApiTypes, MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { api } from "~/api/instance";
import { type RequestOptions } from "@movie-tracker/utils"


export const getMediaListsApi = async (options?: RequestOptions) => {
  return api.get<MediaListType[]>("media-list", options);
}

export const getMediaListsByIdApi = async (mediaListId: string) => {
  return api.get<MediaListType>(`media-list/${mediaListId}`);
}

export const createMediaListsApi = async (body: MediaListUpdateApiTypes) => {
  return api.post("media-list", body);
}

export const createMediaListsCloneApi = async (id: string, body: MediaListCreateCloneApiTypes) => {
  return api.post<MediaListType>(`media-list/${id}/clone`, body);
}

export const deleteMediaListsApi = async (mediaListId: string) => {
  return api.delete<MediaListType>(`media-list/${mediaListId}`);
}

export const updateMediaListsApi = async (mediaListId: string, body: MediaListUpdateApiTypes) => {
  return api.patch<MediaListType>(`media-list/${mediaListId}`, body);
}

