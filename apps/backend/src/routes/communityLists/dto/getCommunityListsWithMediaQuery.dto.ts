import { PaginationDto } from "@/shared/dto/pagination.dto"
import { Type } from "class-transformer"
import { IsNumber } from "class-validator"

export class GetCommunityListsWithMediaQueryDto extends PaginationDto {
  @Type(() => Number)
  @IsNumber()
  mediaId: number
}
