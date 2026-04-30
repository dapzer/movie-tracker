import { GetCommunityListsWeekTopQueries } from "@movie-tracker/types"
import { createCommunityListsQueryDto } from "./base-query"

const sortByOptions = ["views", "createdAt", "updatedAt"] as const

export class GetCommunityListsWeekTopQueryDto extends createCommunityListsQueryDto(sortByOptions) implements GetCommunityListsWeekTopQueries {}
