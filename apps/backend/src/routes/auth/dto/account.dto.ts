import { Account } from '@prisma/client';
import { IsDateString, IsInt, IsMongoId, IsString } from 'class-validator';

export class AccountDto implements Account {
  @IsMongoId()
  id: string;

  @IsMongoId()
  userId: string;

  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsString()
  provider: string;

  @IsString()
  providerAccountId: string;

  @IsInt()
  expires_at: number;

  @IsString()
  type: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
