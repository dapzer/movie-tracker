import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @IsMongoId()
  userId: string;
}
