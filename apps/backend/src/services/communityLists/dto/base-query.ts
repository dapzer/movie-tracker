import { SortOrderEnum } from "@movie-tracker/types"
import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class CommunityListsBaseQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string
}

export function createSortByField<T extends readonly string[]>(options: T) {
  class SortByMixin {
    @ApiPropertyOptional({ enum: options })
    @IsOptional()
    @IsIn(options)
    sortBy?: T[number]
  }

  return SortByMixin
}

export function createCommunityListsQueryDto<T extends readonly string[]>(options: T) {
  return IntersectionType(CommunityListsBaseQueryDto, createSortByField(options))
}
