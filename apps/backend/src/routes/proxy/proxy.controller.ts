import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('image/:everything(*)')
  @Header('Content-Type', 'image/webp')
  async getImage(
    @Query() queries: ProxyQueriesDto,
    @Param('everything') everything: string,
  ) {
    const image = await this.proxyService.getImage(everything, queries.size);

    return new StreamableFile(image);
  }

  @Get('content/:everything(*)')
  @UseInterceptors(CacheInterceptor)
  async getResizedImage(
    @Param('everything') everything: string,
    @Query() queries: Record<string, string>,
  ) {
    return this.proxyService.getResponse(everything, queries);
  }
}
