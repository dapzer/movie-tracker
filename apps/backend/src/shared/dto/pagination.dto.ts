import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, Max, Min } from "class-validator"

export class PaginationDto {
  @ApiProperty({ type: Number, example: 4 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset: number = 0

  @ApiProperty({ type: Number, example: 4 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit: number = 20
}
