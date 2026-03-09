import { IsOptional, IsUUID } from "class-validator"

export class GetAllMediaListsDto {
  @IsOptional()
  @IsUUID()
  userId: string
}
