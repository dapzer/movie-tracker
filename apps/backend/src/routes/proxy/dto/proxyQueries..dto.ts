import { IsOptional, IsString } from 'class-validator';

export class ProxyQueriesDto {
  @IsOptional()
  @IsString()
  size?: string;
}
