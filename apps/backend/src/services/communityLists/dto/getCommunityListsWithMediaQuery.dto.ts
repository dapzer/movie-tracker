import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const getCommunityListsWithMediaQuerySchema = PaginationDto.schema.extend({
  mediaId: z.coerce.number().meta({ example: 123 }),
  title: z.string().optional().meta({ example: "anime" }),
})

export class GetCommunityListsWithMediaQueryDto extends createZodDto(getCommunityListsWithMediaQuerySchema) {}
