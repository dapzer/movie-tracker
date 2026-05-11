import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getAllMediaListsSchema = z.object({
  userId: z.string().uuid().optional().meta({ format: "uuid" }),
})

export class GetAllMediaListsDto extends createZodDto(getAllMediaListsSchema) {}
