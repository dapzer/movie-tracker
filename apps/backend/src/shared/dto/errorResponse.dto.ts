import { ApiProperty } from "@nestjs/swagger"

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number

  @ApiProperty({ example: "Bad Request" })
  message: string

  @ApiProperty({ example: "2026-04-29T12:34:56.789Z" })
  timestamp: string

  @ApiProperty({ example: "/api/media-ratings" })
  path: string
}
