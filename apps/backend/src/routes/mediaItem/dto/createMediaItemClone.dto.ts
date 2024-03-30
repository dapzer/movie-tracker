import { IsBoolean, IsUUID } from 'class-validator';

export class CreateMediaItemCloneDto {
  @IsUUID()
  mediaListId: string;

  @IsBoolean()
  isSaveCreationDate: boolean;
}
