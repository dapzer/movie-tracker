import { IsString, IsUrl } from 'class-validator';

export class GetOpenGraphImageDto {
  @IsUrl()
  imageUrl: string;

  @IsString()
  title?: string;
}
