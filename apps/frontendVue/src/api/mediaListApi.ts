import { fetchWihCredentials } from "#imports";
import { generateApiUrl } from "@movie-tracker/utils";
import type { MediaListType } from "@movie-tracker/types";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const getMediaListsApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/mediaList"));
  const data = await response.json();

  if (response.ok) {
    return data as MediaListType[];
  }

  throw new Error(`Error when getting lists. Code: ${data.statusCode}`);
}


export const getMediaListsByIdApi = async (mediaListId: string) => {
  const response = await fetchWihCredentials(getApiUrl(`/mediaList/${mediaListId}`));
  const data = await response.json();

  if (response.ok) {
    return data as MediaListType;
  }

  throw new Error(`Error when getting list by id. Code: ${data.statusCode}`);
}

export const createMediaListsApi = async (body: MediaListUpdateApiTypes) => {
  const response = await fetchWihCredentials(getApiUrl("/mediaList"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaListType;
  }

  throw new Error(`Error when creating list. Code: ${data.statusCode}`);
}

export const deleteMediaListsApi = async (mediaListId: string) => {
  const response = await fetchWihCredentials(getApiUrl(`/mediaList/${mediaListId}`), {
    method: "DELETE",
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaListType;
  }

  throw new Error(`Error when deleting list. Code: ${data.statusCode}`);
}



export const updateMediaListsApi = async (mediaListId: string, body: MediaListUpdateApiTypes) => {
  const response = await fetchWihCredentials(getApiUrl(`/mediaList/${mediaListId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaListType;
  }

  throw new Error(`Error when updating list. Code: ${data.statusCode}`);
}

