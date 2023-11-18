import { IsMongoId } from 'class-validator';

export class MongoDbIdDto {
  @IsMongoId()
  id: string;
}
