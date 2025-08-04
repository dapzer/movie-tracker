import type {
  GetCommunityListsAllTimeTopQueries,
  GetCommunityListsNewestQueries,
  GetCommunityListsSearchQueries,
  GetCommunityListsWeekTopQueries,
  GetCommunityListsWithMediaQueries,
} from "@movie-tracker/types"
import type { Ref } from "vue"
import { useRequestHeaders } from "#app"
import { useQuery } from "@tanstack/vue-query"
import {
  getCommunityListsAllTimeTopApi,
  getCommunityListsNewestApi,
  getCommunityListsSearchApi,
  getCommunityListsWeekTopApi,
  getCommunityListsWithMediaApi,
} from "./communityListsApi"
import { CommunityListsApiQueryKeys } from "./communityListsApiQueryKeys"

export function useGetCommunityListsWeekTopApi(queries?: Ref<GetCommunityListsWeekTopQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_WEEK_TOP, queries],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getCommunityListsWeekTopApi({ queries: queries?.value, options: { headers } })
    },
  })
}

export function useGetCommunityListsAllTimeTopApi(queries?: Ref<GetCommunityListsAllTimeTopQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_ALL_TIME_TOP, queries],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getCommunityListsAllTimeTopApi({ queries: queries?.value, options: { headers } })
    },
  })
}

export function useGetCommunityListsNewestApi(queries?: Ref<GetCommunityListsNewestQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_NEWEST, queries],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getCommunityListsNewestApi({ queries: queries?.value, options: { headers } })
    },
  })
}

export function useGetCommunityListsSearchApi(queries?: Ref<GetCommunityListsSearchQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_SEARCH, queries],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getCommunityListsSearchApi({ queries: queries?.value, options: { headers } })
    },
  })
}

export function useGetCommunityListsWithMediaApi(queries?: Ref<GetCommunityListsWithMediaQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_WITH_MEDIA, queries],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getCommunityListsWithMediaApi({ queries: queries?.value, options: { headers } })
    },
    retry: false,
    retryOnMount: false,
  })
}
