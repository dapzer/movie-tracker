import { IsString } from "class-validator";

export class CuidDto {
  @IsString()
  id: string;
}
