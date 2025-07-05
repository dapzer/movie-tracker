import type {
  GetCommunityListsAllTimeTopQueries,
  GetCommunityListsNewestQueries,
  GetCommunityListsSearchQueries,
  GetCommunityListsWeekTopQueries,
  GetCommunityListsWithMediaQueries,
  MediaListsPaginatedType,
} from "@movie-tracker/types"
import { api } from "~/api/instance"

export function getCommunityListsWeekTopApi(args: { queries: GetCommunityListsWeekTopQueries }) {
  return api.get<MediaListsPaginatedType>("community-lists/week-top", {
    params: {
      ...args.queries,
    },
  })
}

export function getCommunityListsAllTimeTopApi(args: { queries: GetCommunityListsAllTimeTopQueries }) {
  return api.get<MediaListsPaginatedType>("community-lists/all-time-top", {
    params: {
      ...args.queries,
    },
  })
}

export function getCommunityListsNewestApi(args: { queries: GetCommunityListsNewestQueries }) {
  return api.get<MediaListsPaginatedType>("community-lists/new-to-explore", {
    params: {
      ...args.queries,
    },
  })
}

export function getCommunityListsSearchApi(args: { queries: GetCommunityListsSearchQueries }) {
  return api.get<MediaListsPaginatedType>("community-lists/search", {
    params: {
      ...args.queries,
    },
  })
}

export function getCommunityListsWithMediaApi(args: { queries: GetCommunityListsWithMediaQueries }) {
  return api.get<MediaListsPaginatedType>("community-lists/with-media", {
    params: {
      ...args.queries,
    },
  })
}
