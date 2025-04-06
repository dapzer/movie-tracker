import { IsString } from "class-validator"

export class GetMedialListByIdDto {
  @IsString()
  id: string
}
