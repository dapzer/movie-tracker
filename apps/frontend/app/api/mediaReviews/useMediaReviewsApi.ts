import type { MediaReview } from "@movie-tracker/types"
import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  CreateMediaReviewBody,
  CreateMediaReviewDislikeBody,
  CreateMediaReviewLikeBody,
  DeleteMediaReviewArgs,
  DeleteMediaReviewDislikeArgs,
  DeleteMediaReviewLikeArgs,
  GetMediaReviewByIdArgs,
  GetMediaReviewDislikesByReviewIdArgs,
  GetMediaReviewLikesByReviewIdArgs,
  GetMediaReviewsByMediaIdArgs,
  GetMediaReviewsByUserIdArgs,
  UpdateMediaReviewArgs,
} from "~/api/mediaReviews/mediaReviewsApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  createMediaReviewApi,
  createMediaReviewDislikeApi,
  createMediaReviewLikeApi,
  deleteMediaReviewApi,
  deleteMediaReviewDislikeApi,
  deleteMediaReviewLikeApi,
  getMediaReviewByIdApi,
  getMediaReviewDislikesByReviewIdApi,
  getMediaReviewLikesByReviewIdApi,
  getMediaReviewsByMediaIdApi,
  getMediaReviewsByUserIdApi,
  updateMediaReviewApi,
} from "~/api/mediaReviews/mediaReviewsApi"
import { MediaReviewsApiQueryKeys } from "~/api/mediaReviews/mediaReviewsApiQueryKeys"

export function useGetMediaReviewByIdApi(args: Ref<GetMediaReviewByIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaReviewsApiQueryKeys.GET_BY_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewByIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useGetMediaReviewsByMediaIdApi(args: Ref<GetMediaReviewsByMediaIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewsByMediaIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useGetMediaReviewsByUserIdApi(args: Ref<GetMediaReviewsByUserIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaReviewsApiQueryKeys.GET_BY_USER_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewsByUserIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateMediaReviewApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.CREATE],
    mutationFn: (body: CreateMediaReviewBody) => createMediaReviewApi(body),
    onSuccess: async (data: MediaReview) => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_USER_ID],
      })
      queryClient.setQueryData([MediaReviewsApiQueryKeys.GET_BY_ID, { id: data.id }], data)
    },
  })
}

export function useUpdateMediaReviewApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.UPDATE],
    mutationFn: (args: UpdateMediaReviewArgs) => updateMediaReviewApi(args),
    onSuccess: async (data: MediaReview) => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_USER_ID],
      })
      queryClient.setQueryData([MediaReviewsApiQueryKeys.GET_BY_ID, { id: data.id }], data)
    },
  })
}

export function useDeleteMediaReviewApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.DELETE],
    mutationFn: (args: DeleteMediaReviewArgs) => deleteMediaReviewApi(args),
    onSuccess: async (data: MediaReview) => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_USER_ID],
      })
      queryClient.removeQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_ID, { id: data.id }],
      })
    },
  })
}

export function useGetMediaReviewLikesByReviewIdApi(args: Ref<GetMediaReviewLikesByReviewIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaReviewsApiQueryKeys.GET_LIKES_BY_REVIEW_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewLikesByReviewIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateMediaReviewLikeApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.CREATE_LIKE],
    mutationFn: (body: CreateMediaReviewLikeBody) => createMediaReviewLikeApi(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
    },
  })
}

export function useDeleteMediaReviewLikeApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.DELETE_LIKE],
    mutationFn: (args: DeleteMediaReviewLikeArgs) => deleteMediaReviewLikeApi(args),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
    },
  })
}

export function useGetMediaReviewDislikesByReviewIdApi(args: Ref<GetMediaReviewDislikesByReviewIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [MediaReviewsApiQueryKeys.GET_DISLIKES_BY_REVIEW_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getMediaReviewDislikesByReviewIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateMediaReviewDislikeApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.CREATE_DISLIKE],
    mutationFn: (body: CreateMediaReviewDislikeBody) => createMediaReviewDislikeApi(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
    },
  })
}

export function useDeleteMediaReviewDislikeApi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MediaReviewsApiQueryKeys.DELETE_DISLIKE],
    mutationFn: (args: DeleteMediaReviewDislikeArgs) => deleteMediaReviewDislikeApi(args),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MediaReviewsApiQueryKeys.GET_BY_MEDIA_ID],
      })
    },
  })
}
