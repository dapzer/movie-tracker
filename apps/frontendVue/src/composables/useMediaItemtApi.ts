import { MediaItemQueryKeys } from "~/constants/queryKeys";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/vue-query";
import {
  createMediaItemApi,
  deleteMediaItemApi,
  getMediaItemsApi,
  getMediaItemsByMediaListIdApi,
  updateMediaItemApi
} from "~/api/mediaItemApi";
import type { MediaItemType,MediaItemTrackingDataType } from "@movie-tracker/types";
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
  })
}

export const useDeleteMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.DELETE],
    mutationFn: async (id: string) => await deleteMediaItemApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => oldData.filter((item) => item.id !== data.id));
    }
  })
}

export const useUpdateMediaItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaItemQueryKeys.UPDATE],
    mutationFn: async (args: { mediaItemId: string, body: MediaItemTrackingDataType }) => await updateMediaItemApi(args.mediaItemId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => oldData.map((item) => item.id === data.id ? data : item));
    }
  })
}
