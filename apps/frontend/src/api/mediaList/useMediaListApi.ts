import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/vue-query";
import {
  createMediaListsApi,
  createMediaListsCloneApi,
  deleteMediaListsApi,
  getMediaListsApi,
  getMediaListsByIdApi,
  updateMediaListsApi
} from "~/api/mediaList/mediaListApi";
import type { MediaItemType, MediaListType } from "@movie-tracker/types";
import type { MediaListCreateCloneApiTypes, MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys";
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys";
import { useRequestHeaders } from "#app"

export const useGetMediaListsApi = () => {
  const headers = useRequestHeaders(["cookie", "connect.sid"]);

  return useQuery({
    queryKey: [MediaListQueryKeys.GET_ALL],
    queryFn: () => getMediaListsApi({ headers }),
    retry: false
  })
};

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

export const useCreateMediaListCloneApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MediaListQueryKeys.CREATE],
    mutationFn: async (args: {
      mediaListId: string,
      body: MediaListCreateCloneApiTypes
    }) => await createMediaListsCloneApi(args.mediaListId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => [...oldData, data]);
      await queryClient.refetchQueries({
        queryKey: [MediaItemQueryKeys.GET_ALL]
      });
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
    mutationFn: async (args: {
      mediaListId: string,
      body: MediaListUpdateApiTypes
    }) => await updateMediaListsApi(args.mediaListId, args.body),
    onSuccess: async (data) => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => oldData.map((listItem) => listItem.id === data.id ? data : listItem));
    }
  });
};

