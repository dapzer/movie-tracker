import { PaginationDto } from "@/shared/dto/pagination.dto"
import { MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT } from "@movie-tracker/types"
import { IsString, Length } from "class-validator"

export class GetCommunityListsByTitleQueryDto extends PaginationDto {
  @IsString()
  @Length(1, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  title: string
}
