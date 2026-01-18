import { IsUUID } from "class-validator"

export class GetReleaseSubscriptionsByUserIdQueryDto {
  @IsUUID()
  userId: string
}
