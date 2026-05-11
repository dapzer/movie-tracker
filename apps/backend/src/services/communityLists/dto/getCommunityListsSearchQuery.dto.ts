import { MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const getCommunityListsSearchQuerySchema = PaginationDto.schema.extend({
  title: z.string().min(1).max(MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT).meta({ example: "my best lsit" }),
})

export class GetCommunityListsSearchQueryDto extends createZodDto(getCommunityListsSearchQuerySchema) {}
