import {
  MediaTypeEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaDetailsInfoSeasonEpisodeSchema = z.object({
  airDate: z.string().meta({ example: "2024-01-15" }),
  episodeNumber: z.number().meta({ example: 1 }),
  seasonNumber: z.number().meta({ example: 1 }),
  poster: z.string().optional().meta({ example: "/poster.jpg" }),
  name: z.string().meta({ example: "Pilot" }),
})

const mediaDetailsInfoSeasonSchema = z.object({
  name: z.string().meta({ example: "Season 1" }),
  airDate: z.string().meta({ example: "2024-01-01" }),
  episodeCount: z.number().meta({ example: 10 }),
  episodes: z.array(mediaDetailsInfoSeasonEpisodeSchema),
  seasonNumber: z.number().meta({ example: 1 }),
})

const mediaDetailsInfoSchema = z.object({
  title: z.string().meta({ example: "Inception" }),
  originalTitle: z.string().meta({ example: "Inception" }),
  poster: z.string().meta({ example: "/poster.jpg" }),
  seasons: z.array(mediaDetailsInfoSeasonSchema).optional(),
})

const mediaDetailsSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid", example: "c91f2c3e-6c4f-4a2a-9f1c-2c8e9b7a1d55" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  score: z.number().min(0).max(10).meta({ minimum: 0, maximum: 10, example: 8 }),
  genres: z.array(z.number()).meta({ example: [28, 12] }),
  status: z.string().optional().meta({ example: "Released" }),
  releaseDate: z.string().optional().meta({ example: "2010-07-16" }),
  en: mediaDetailsInfoSchema,
  ru: mediaDetailsInfoSchema,
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
  updatedAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
})

export class MediaDetailsInfoSeasonEpisodeDto extends createZodDto(mediaDetailsInfoSeasonEpisodeSchema) {}

export class MediaDetailsInfoSeasonDto extends createZodDto(mediaDetailsInfoSeasonSchema) {}

export class MediaDetailsInfoDto extends createZodDto(mediaDetailsInfoSchema) {}

export class MediaDetailsDto extends createZodDto(mediaDetailsSchema) {}
