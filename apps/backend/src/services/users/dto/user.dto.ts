import {
  SignUpMethodEnum,
  UserMediaRatingsAccessLevelEnum,
  UserRoleEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

export const userSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
  name: z.string().meta({ example: "John Doe" }),
  email: z.string().email().optional().meta({ example: "user@example.com" }),
  image: z.string().url().meta({ example: "https://cdn.example.com/avatar.jpg" }),
  password: z.string().min(8).max(32).optional().meta({ minLength: 8, maxLength: 32, example: "StrongPass123" }),
  isEmailVerified: z.boolean().meta({ example: true }),
  roles: z.array(z.enum(UserRoleEnum)).meta({ enum: UserRoleEnum, isArray: true, example: [UserRoleEnum.USER] }),
  signUpMethod: z.enum(SignUpMethodEnum).meta({ enum: SignUpMethodEnum, example: SignUpMethodEnum.EMAIL }),
  mediaRatingsAccessLevel: z
    .enum(UserMediaRatingsAccessLevelEnum)
    .optional()
    .meta({ enum: UserMediaRatingsAccessLevelEnum, example: UserMediaRatingsAccessLevelEnum.PUBLIC }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2024-01-01T12:00:00.000Z" }),
  updatedAt: zDateTimeString.meta({ format: "date-time", example: "2024-01-02T12:00:00.000Z" }),
})

export const optionalUserSchema = userSchema.optional()

export class UserDto extends createZodDto(userSchema) {}

export class OptionalUserDto extends createZodDto(optionalUserSchema) {}
