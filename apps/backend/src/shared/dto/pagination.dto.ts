import { IsNumber, IsOptional, Max, Min } from "class-validator"

export class PaginationDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset: number

  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit: number
}
