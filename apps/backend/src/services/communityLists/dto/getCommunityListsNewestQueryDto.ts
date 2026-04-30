import { GetCommunityListsNewestQueries } from "@movie-tracker/types"
import { createCommunityListsQueryDto } from "./base-query"

const sortByOptions = ["createdAt", "updatedAt"] as const

export class GetCommunityListsNewestQueryDto extends createCommunityListsQueryDto(sortByOptions) implements GetCommunityListsNewestQueries {}
