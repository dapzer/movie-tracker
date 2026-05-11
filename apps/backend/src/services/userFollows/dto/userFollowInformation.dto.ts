import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const userFollowInformationSchema = z.object({
  followersCount: z.number().meta({ example: 123 }),
  isFollowing: z.boolean().meta({ example: false }),
})

export class UserFollowInformationDto extends createZodDto(userFollowInformationSchema) {}
