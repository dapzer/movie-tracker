import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ProxyQueriesDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  size?: string;
}
