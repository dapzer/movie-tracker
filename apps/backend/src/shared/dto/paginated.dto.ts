import { Type } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"

export function PaginatedDto<T>(classRef: Type<T>) {
  class PaginatedRes {
    @ApiProperty({ type: [classRef] })
    items: T[]

    @ApiProperty({ type: Number, example: 1 })
    totalCount: number
  }

  return PaginatedRes
}
