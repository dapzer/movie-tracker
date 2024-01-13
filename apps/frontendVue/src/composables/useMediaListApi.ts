import { useMutation, useQuery, useQueryClient,type UseQueryOptions } from "@tanstack/vue-query";
import { MediaItemQueryKeys, MediaListQueryKeys } from "~/constants/queryKeys";
import {
  createMediaListsApi,
  deleteMediaListsApi,
  getMediaListsApi,
  getMediaListsByIdApi,
  updateMediaListsApi
} from "~/api/mediaListApi";
import type { MediaListType, MediaItemType } from "@movie-tracker/types";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";

export const useGetMediaListsApi = () => useQuery({
  queryKey: [MediaListQueryKeys.GET_ALL],
  queryFn: async () => await getMediaListsApi(),
  retry: false
});

export const useGetMediaListsByIdApi = (mediaListId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) => useQuery({
  queryKey: [MediaListQueryKeys.GET_BY_ID, mediaListId],
  queryFn: async () => await getMediaListsByIdApi(mediaListId),
  ...options
});

export const useCreateMediaListApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE],
    mutationFn: async (body: MediaListUpdateApiTypes) => await createMediaListsApi(body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => [...oldData, data]);
    }
  });
};

export const useDeleteMediaListApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaListQueryKeys.DELETE],
    mutationFn: async (id: string) => await deleteMediaListsApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => oldData.filter((list) => list.id !== data.id));
      await queryClient.setQueryData([MediaItemQueryKeys.GET_ALL], (oldData: MediaItemType[]) => oldData.filter((item) => item.mediaListId !== data.id));
    }
  });
};


export const useUpdateMediaListApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaListQueryKeys.UPDATE],
    mutationFn: async (args: { mediaListId: string, body: MediaListUpdateApiTypes }) => await updateMediaListsApi(args.mediaListId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => oldData.map((listItem) => listItem.id === data.id ? data : listItem));
    }
  });
};
