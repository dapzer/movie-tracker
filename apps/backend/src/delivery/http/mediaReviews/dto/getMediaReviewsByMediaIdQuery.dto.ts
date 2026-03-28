import { MediaReviewStatus } from "@movie-tracker/types"
import { IsEnum, IsOptional } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetMediaReviewsByMediaIdQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(MediaReviewStatus)
  status?: MediaReviewStatus
}
