import type { MediaListType } from "@movie-tracker/types";
import type { MediaListCreateCloneApiTypes, MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { api } from "~/api/instance";


export const getMediaListsApi = async () => {
  return api.get<MediaListType[]>("mediaList");
}

export const getMediaListsByIdApi = async (mediaListId: string) => {
  return api.get<MediaListType>(`mediaList/${mediaListId}`);
}

export const createMediaListsApi = async (body: MediaListUpdateApiTypes) => {
  return api.post("mediaList", body);
}

export const createMediaListsCloneApi = async (id: string, body: MediaListCreateCloneApiTypes) => {
  return api.post<MediaListType>(`mediaList/${id}/clone`, body);
}

export const deleteMediaListsApi = async (mediaListId: string) => {
  return api.delete<MediaListType>(`mediaList/${mediaListId}`);
}

export const updateMediaListsApi = async (mediaListId: string, body: MediaListUpdateApiTypes) => {
  return api.patch<MediaListType>(`mediaList/${mediaListId}`, body);
}

