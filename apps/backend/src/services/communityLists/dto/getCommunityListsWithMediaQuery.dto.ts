import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetCommunityListsWithMediaQueryDto extends PaginationDto {
  @Type(() => Number)
  @IsNumber()
  mediaId: number

  @IsOptional()
  @IsString()
  title?: string
}
