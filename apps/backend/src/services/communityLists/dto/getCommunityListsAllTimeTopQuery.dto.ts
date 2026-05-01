import {
  GetCommunityListsAllTimeTopQueries,
  SortOrderEnum,
} from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsAllTimeTopQueries["sortBy"][] = ["likes", "createdAt", "updatedAt"]

export class GetCommunityListsAllTimeTopQueryDto extends PaginationDto implements GetCommunityListsAllTimeTopQueries {
  @ApiPropertyOptional({ enum: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional({ enum: sortByOptions })
  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsAllTimeTopQueries["sortBy"]

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string
}
