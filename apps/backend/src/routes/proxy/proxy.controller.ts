import { Controller, Get, Header, Query, StreamableFile } from '@nestjs/common';
import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async getResponse(@Query() queries: ProxyQueriesDto) {
    return this.proxyService.getResponse(queries.url);
  }

  @Get('image')
  @Header('Content-Type', 'image/webp')
  async getImage(@Query() queries: ProxyQueriesDto) {
    const image = await this.proxyService.getImage(queries.url, queries.size);

    return new StreamableFile(image);
  }
}
