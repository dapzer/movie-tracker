import { IsMongoId, IsOptional } from 'class-validator';

export class GetAllMediaListsDto {
  @IsOptional()
  @IsMongoId()
  userId: string;
}
