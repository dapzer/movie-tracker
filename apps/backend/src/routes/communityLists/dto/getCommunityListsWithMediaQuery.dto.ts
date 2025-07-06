import { PaginationDto } from "@/shared/dto/pagination.dto"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class GetCommunityListsWithMediaQueryDto extends PaginationDto {
  @Type(() => Number)
  @IsNumber()
  mediaId: number

  @IsOptional()
  @IsString()
  title?: string
}
