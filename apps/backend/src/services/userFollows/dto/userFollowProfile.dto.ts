import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const userFollowProfileSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  name: z.string().meta({ example: "Raphaël Ambrosius Costeau" }),
  image: z.string().meta({ example: "https://avatars.githubusercontent.com/u/00000?v=4" }),
  followersCount: z.number().meta({ example: 123 }),
  isFollowing: z.boolean().meta({ example: false }),
})

export class UserFollowProfileDto extends createZodDto(userFollowProfileSchema) {}
