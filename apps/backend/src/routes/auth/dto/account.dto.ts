import { AccountType } from "@/repositories/account/AccountRepositoryInterface"
import { IsDateString, IsInt, IsString, IsUUID } from "class-validator"

export class AccountDto implements AccountType {
  @IsUUID()
  id: string

  @IsUUID()
  userId: string

  @IsString()
  access_token: string

  @IsString()
  refresh_token: string

  @IsString()
  provider: string

  @IsString()
  providerAccountId: string

  @IsInt()
  expires_at: number

  @IsString()
  type: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
