import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { zBooleanQuery } from "@/shared/dto/zod.utils"

const getUserBansQuerySchema = PaginationDto.schema.extend({
  expired: zBooleanQuery.optional().meta({ example: false }),
  userId: z.uuid().optional().meta({ format: "uuid" }),
})

export class GetUserBansQueryDto extends createZodDto(getUserBansQuerySchema) {}
