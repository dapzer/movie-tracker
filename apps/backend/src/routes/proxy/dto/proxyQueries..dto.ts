import { IsUrl } from 'class-validator';

export class ProxyQueriesDto {
  @IsUrl()
  url: string;
}
