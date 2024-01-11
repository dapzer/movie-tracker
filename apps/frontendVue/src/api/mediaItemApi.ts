import { fetchWihCredentials } from "#imports";
import { generateApiUrl } from "@movie-tracker/utils";
import type { MediaItemType, MediaItemTrackingDataType } from "@movie-tracker/types";
import type { MediaItemCreateApiTypes } from "~/types/mediaItemApiTypes";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const getMediaItemsApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/mediaItem"));
  const data = await response.json();

  if (response.ok) {
    return data as MediaItemType[];
  }

  throw new Error(`Error when getting media items. Code: ${data.statusCode}`);
}

export const createMediaItemApi = async (body: MediaItemCreateApiTypes) => {
  const response = await fetchWihCredentials(getApiUrl("/mediaItem"), {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaItemType;
  }

  throw new Error(`Error when creating media item. Code: ${data.statusCode}`);
}

export const deleteMediaItemApi = async (mediaItemId: string) => {
  const response = await fetchWihCredentials(getApiUrl(`/mediaItem/${mediaItemId}`), {
    method: "DELETE",
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaItemType;
  }

  throw new Error(`Error when deleting media item. Code: ${data.statusCode}`);
}



export const updateMediaItemApi = async (mediaItemId: string, body: MediaItemTrackingDataType) => {
  const response = await fetchWihCredentials(getApiUrl(`/mediaItem/${mediaItemId}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (response.ok) {
    return data as MediaItemType;
  }

  throw new Error(`Error when updating media item. Code: ${data.statusCode}`);
}
