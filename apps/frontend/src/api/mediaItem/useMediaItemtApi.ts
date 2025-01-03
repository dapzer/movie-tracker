import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/vue-query";
import {
  createMediaItemApi,
  createMediaItemCloneApi,
  deleteMediaItemApi,
  getMediaItemsApi,
  getMediaItemsByMediaListIdApi,
  updateMediaItemApi,
  updateMediaItemTrackingDataApi
} from "~/api/mediaItem/mediaItemApi";
import type { MediaItemTrackingDataType, MediaItemType } from "@movie-tracker/types";
import type { MediaItemCreateApiTypes, MediaItemUpdateApiTypes } from "~/api/mediaItem/mediaItemApiTypes";
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys";
import { useRequestHeaders } from "#app"

export const useGetMediaItemsApi = () => {

  return useQuery({
    queryKey: [MediaItemQueryKeys.GET_ALL],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"]);

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found");
      }
      
      return getMediaItemsApi({
        headers
      })
    },
    retry: false
  })
};

export const useGetMediaItemsByMediaListIdApi = (mediaListId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) => useQuery({
  queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID, mediaListId],
  queryFn: () => getMediaItemsByMediaListIdApi(mediaListId),
  ...options
});


export const useCreateMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE],
    mutationFn: (args: MediaItemCreateApiTypes) => createMediaItemApi(args),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, data]);
    }
  });
};

export const useDeleteMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.DELETE],
    mutationFn: (id: string) => deleteMediaItemApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.filter((item) => item.id !== data.id);
      });
    }
  });
};

export const useUpdateMediaItemTrackingDataApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE_TRACKING_DATA],
    mutationFn: (args: {
      trackingDataId: string,
      body: MediaItemTrackingDataType
    }) => updateMediaItemTrackingDataApi(args.trackingDataId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.map((item) => item.id !== data.mediaItemId ? item : {
          ...item,
          trackingData: data
        });
      });
    }
  });
};

export const useCreateMediaItemCloneApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE_CLONE],
    mutationFn: createMediaItemCloneApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, data]);
    }
  });
};

export const useUpdateMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE],
    mutationFn: (args: {
      mediaItemId: string,
      body: MediaItemUpdateApiTypes
    }) => updateMediaItemApi(args.mediaItemId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => {
        return oldData.map((item) => item.id !== data.id ? item : data);
      });
    }
  });

};
