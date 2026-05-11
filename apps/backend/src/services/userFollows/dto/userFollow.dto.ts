import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"
import { UserFollowProfileDto } from "./userFollowProfile.dto"

const userFollowSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  followerId: z.string().uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  followingId: z.string().uuid().meta({ format: "uuid", example: "c0a5db1e-7a67-4b60-8b1f-53f3a7c3d7b1" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
  followerUserProfile: UserFollowProfileDto.schema.optional(),
  followingUserProfile: UserFollowProfileDto.schema.optional(),
})

export class UserFollowDto extends createZodDto(userFollowSchema) {}
