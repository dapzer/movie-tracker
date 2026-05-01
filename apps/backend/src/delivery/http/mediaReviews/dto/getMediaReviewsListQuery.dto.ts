import { MediaReviewStatus } from "@movie-tracker/types"
import { IsEnum, IsOptional } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetMediaReviewsListQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(MediaReviewStatus)
  status?: MediaReviewStatus = MediaReviewStatus.PUBLISHED
}
