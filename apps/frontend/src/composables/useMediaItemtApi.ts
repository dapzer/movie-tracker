import { MediaItemQueryKeys } from "~/constants/queryKeys";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/vue-query";
import {
  createMediaItemApi,
  deleteMediaItemApi,
  getMediaItemsApi,
  getMediaItemsByMediaListIdApi,
  updateMediaItemTrackingDataApi
} from "~/api/mediaItemApi";
import type { MediaItemTrackingDataType, MediaItemType } from "@movie-tracker/types";
import type { MediaItemCreateApiTypes } from "~/types/mediaItemApiTypes";

export const useGetMediaItemsApi = () => useQuery({
  queryKey: [MediaItemQueryKeys.GET_ALL],
  queryFn: async () => await getMediaItemsApi(),
  retry: false
});

export const useGetMediaItemsByMediaListIdApi = (mediaListId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) => useQuery({
  queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID, mediaListId],
  queryFn: async () => await getMediaItemsByMediaListIdApi(mediaListId),
  ...options
});


export const useCreateMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.CREATE],
    mutationFn: async (args: MediaItemCreateApiTypes) => await createMediaItemApi(args),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => [...oldData, data]);
    }
  });
};

export const useDeleteMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.DELETE],
    mutationFn: async (id: string) => await deleteMediaItemApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => oldData.filter((item) => item.id !== data.id));
    }
  });
};

export const useUpdateMediaItemTrackingDataApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE],
    mutationFn: async (args: {
      trackingDataId: string,
      body: MediaItemTrackingDataType
    }) => await updateMediaItemTrackingDataApi(args.trackingDataId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => oldData.map((item) => item.id !== data.mediaItemId ? item : {
        ...item,
        trackingData: data
      }));
    }
  });
};
