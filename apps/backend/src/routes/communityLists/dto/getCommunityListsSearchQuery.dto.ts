import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsSearchQueries, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT } from "@movie-tracker/types"
import { IsString, Length } from "class-validator"

export class GetCommunityListsSearchQueryDto extends PaginationDto implements GetCommunityListsSearchQueries {
  @IsString()
  @Length(1, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  title: string
}
