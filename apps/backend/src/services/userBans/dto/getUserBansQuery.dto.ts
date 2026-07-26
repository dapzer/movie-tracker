import { UserBanStatusFilterValues } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

function parseStringArrayQuery(value: unknown): string[] | undefined {
  if (!value) {
    return undefined
  }

  return Array.isArray(value)
    ? value.filter(Boolean)
    : String(value)
        .split(",")
        .map(v => v.trim())
        .filter(Boolean)
}

const getUserBansQuerySchema = PaginationDto.schema.extend({
  status: z
    .preprocess(
      value => parseStringArrayQuery(value),
      z.array(z.enum(UserBanStatusFilterValues)),
    )
    .optional()
    .meta({ enum: UserBanStatusFilterValues, required: false, isArray: true, example: ["active", "revoked"] }),
  userId: z.uuid().optional().meta({ format: "uuid" }),
})

export class GetUserBansQueryDto extends createZodDto(getUserBansQuerySchema) {}
