import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetReleaseSubscriptionsByUserIdQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string
}
