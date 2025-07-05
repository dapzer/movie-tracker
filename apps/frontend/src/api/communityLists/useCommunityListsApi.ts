import type {
  GetCommunityListsAllTimeTopQueries,
  GetCommunityListsNewestQueries,
  GetCommunityListsSearchQueries,
  GetCommunityListsWeekTopQueries,
  GetCommunityListsWithMediaQueries,
} from "@movie-tracker/types"
import type { Ref } from "vue"
import { useQuery } from "@tanstack/vue-query"
import {
  getCommunityListsAllTimeTopApi,
  getCommunityListsNewestApi,
  getCommunityListsSearchApi,
  getCommunityListsWeekTopApi,
  getCommunityListsWithMediaApi,
} from "./communityListsApi"
import { CommunityListsApiQueryKeys } from "./communityListsApiQueryKeys"

export function useCommunityListsWeekTopApi(queries: Ref<GetCommunityListsWeekTopQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_WEEK_TOP, queries],
    queryFn: () => getCommunityListsWeekTopApi({ queries: queries.value }),
  })
}

export function useCommunityListsAllTimeTopApi(queries: Ref<GetCommunityListsAllTimeTopQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_ALL_TIME_TOP, queries],
    queryFn: () => getCommunityListsAllTimeTopApi({ queries: queries.value }),
  })
}

export function useCommunityListsNewestApi(queries: Ref<GetCommunityListsNewestQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_NEWEST, queries],
    queryFn: () => getCommunityListsNewestApi({ queries: queries.value }),
  })
}

export function useCommunityListsSearchApi(queries: Ref<GetCommunityListsSearchQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_SEARCH, queries],
    queryFn: () => getCommunityListsSearchApi({ queries: queries.value }),
  })
}

export function useCommunityListsWithMediaApi(queries: Ref<GetCommunityListsWithMediaQueries>) {
  return useQuery({
    queryKey: [CommunityListsApiQueryKeys.GET_WITH_MEDIA, queries],
    queryFn: () => getCommunityListsWithMediaApi({ queries: queries.value }),
  })
}
