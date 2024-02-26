import { IsBoolean, IsUUID } from 'class-validator';

export class CreateMediaItemCopyDto {
  @IsUUID()
  mediaListId: string;

  @IsBoolean()
  isSaveCreationDate: boolean;
}
