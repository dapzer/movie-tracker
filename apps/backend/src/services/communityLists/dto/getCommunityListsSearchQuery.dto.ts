import { GetCommunityListsSearchQueries, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetCommunityListsSearchQueryDto extends PaginationDto implements GetCommunityListsSearchQueries {
  @ApiProperty({ type: String, example: "my best lsit" })
  @IsString()
  @Length(1, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  title: string
}
