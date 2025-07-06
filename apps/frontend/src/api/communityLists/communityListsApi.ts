import type {
  GetCommunityListsAllTimeTopQueries,
  GetCommunityListsNewestQueries,
  GetCommunityListsSearchQueries,
  GetCommunityListsWeekTopQueries,
  GetCommunityListsWithMediaQueries,
  MediaListsPaginatedType,
} from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import { api } from "~/api/instance"

export function getCommunityListsWeekTopApi(args: { queries?: GetCommunityListsWeekTopQueries, options: RequestOptions }) {
  return api.get<MediaListsPaginatedType>("community-lists/week-top", {
    params: {
      ...args.queries,
    },
    ...args.options,
  })
}

export function getCommunityListsAllTimeTopApi(args: { queries?: GetCommunityListsAllTimeTopQueries, options: RequestOptions }) {
  return api.get<MediaListsPaginatedType>("community-lists/all-time-top", {
    params: {
      ...args.queries,
    },
    ...args.options,
  })
}

export function getCommunityListsNewestApi(args: { queries?: GetCommunityListsNewestQueries, options: RequestOptions }) {
  return api.get<MediaListsPaginatedType>("community-lists/newest", {
    params: {
      ...args.queries,
    },
    ...args.options,
  })
}

export function getCommunityListsSearchApi(args: { queries?: GetCommunityListsSearchQueries, options: RequestOptions }) {
  return api.get<MediaListsPaginatedType>("community-lists/search", {
    params: {
      ...args.queries,
    },
    ...args.options,
  })
}

export function getCommunityListsWithMediaApi(args: { queries?: GetCommunityListsWithMediaQueries, options: RequestOptions }) {
  return api.get<MediaListsPaginatedType>("community-lists/with-media", {
    params: {
      ...args.queries,
    },
    ...args.options,
  })
}
