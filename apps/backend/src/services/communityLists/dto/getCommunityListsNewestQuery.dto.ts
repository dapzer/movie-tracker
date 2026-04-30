import {
  GetCommunityListsNewestQueries,
  SortOrderEnum,
} from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsNewestQueries["sortBy"][] = ["createdAt", "updatedAt"]

export class GetCommunityListsNewestQueryDto extends PaginationDto implements GetCommunityListsNewestQueries {
  @ApiPropertyOptional({ enum: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional({ enum: sortByOptions })
  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsNewestQueries["sortBy"]

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string
}
