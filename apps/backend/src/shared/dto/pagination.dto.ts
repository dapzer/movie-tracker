import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, Max, Min } from "class-validator"

export class PaginationDto {
  @ApiPropertyOptional({ type: Number, example: 4 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset: number = 0

  @ApiPropertyOptional({ type: Number, example: 4 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit: number = 20
}
