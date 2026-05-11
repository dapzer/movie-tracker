import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getMedialListByIdSchema = z.object({
  id: z.string().meta({ format: "uuid ot cuid" }),
})

export class GetMedialListByIdDto extends createZodDto(getMedialListByIdSchema) {}
