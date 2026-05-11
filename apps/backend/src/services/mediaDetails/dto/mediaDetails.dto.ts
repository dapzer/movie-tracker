import {
  MediaDetailsInfoSeasonEpisodeType,
  MediaDetailsInfoSeasonType,
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class MediaDetailsInfoSeasonEpisodeDto implements MediaDetailsInfoSeasonEpisodeType {
  @ApiProperty({ type: String, example: "2024-01-15" })
  airDate: string

  @ApiProperty({ type: Number, example: 1 })
  episodeNumber: number

  @ApiProperty({ type: Number, example: 1 })
  seasonNumber: number

  @ApiPropertyOptional({ type: String, example: "/poster.jpg" })
  poster?: string

  @ApiProperty({ type: String, example: "Pilot" })
  name: string
}

export class MediaDetailsInfoSeasonDto implements MediaDetailsInfoSeasonType {
  @ApiProperty({ type: String, example: "Season 1" })
  name: string

  @ApiProperty({ type: String, example: "2024-01-01" })
  airDate: string

  @ApiProperty({ type: Number, example: 10 })
  episodeCount: number

  @ApiProperty({ type: [MediaDetailsInfoSeasonEpisodeDto] })
  episodes: MediaDetailsInfoSeasonEpisodeDto[]

  @ApiProperty({ type: Number, example: 1 })
  seasonNumber: number
}

export class MediaDetailsInfoDto implements MediaDetailsInfoType {
  @ApiProperty({ type: String, example: "Inception" })
  title: string

  @ApiProperty({ type: String, example: "Inception" })
  originalTitle: string

  @ApiProperty({ type: String, example: "/poster.jpg" })
  poster: string

  @ApiPropertyOptional({ type: [MediaDetailsInfoSeasonDto] })
  seasons?: MediaDetailsInfoSeasonDto[]
}

export class MediaDetailsDto implements MediaDetailsType {
  @ApiProperty({ type: String, format: "uuid", example: "c91f2c3e-6c4f-4a2a-9f1c-2c8e9b7a1d55" })
  id: string

  @ApiProperty({ type: Number, example: 550 })
  mediaId: number

  @ApiProperty({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE })
  mediaType: MediaTypeEnum

  @ApiProperty({ type: Number, minimum: 0, maximum: 10, example: 8 })
  score: number

  @ApiProperty({ type: [Number], example: [28, 12] })
  genres: number[]

  @ApiProperty({ type: String, example: "Released" })
  status?: string

  @ApiPropertyOptional({ type: String, example: "2010-07-16" })
  releaseDate?: string

  @ApiProperty({ type: MediaDetailsInfoDto })
  en: MediaDetailsInfoDto

  @ApiProperty({ type: MediaDetailsInfoDto })
  ru: MediaDetailsInfoDto

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  updatedAt: Date
}
