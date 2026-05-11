import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zBooleanQuery } from "@/shared/dto/zod.utils"

const getOpenGraphImageSchema = z.object({
  imageUrl: z.string().url().optional().meta({ example: "https://cdn.example.com/image.jpg" }),
  title: z.string().meta({ example: "My awesome media list" }),
  isAvatarPlaceholder: zBooleanQuery.optional().meta({ example: true }),
})

export class GetOpenGraphImageDto extends createZodDto(getOpenGraphImageSchema) {}
