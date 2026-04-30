import { GetCommunityListsAllTimeTopQueries } from "@movie-tracker/types"
import { createCommunityListsQueryDto } from "./base-query"

const sortByOptions = ["likes", "createdAt", "updatedAt"] as const

export class GetCommunityListsAllTimeTopQueryDto extends createCommunityListsQueryDto(sortByOptions) implements GetCommunityListsAllTimeTopQueries {}
