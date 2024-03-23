import { IsOptional, IsString, IsUrl } from 'class-validator';

export class GetOpenGraphImageDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl: string;

  @IsString()
  title?: string;
}
