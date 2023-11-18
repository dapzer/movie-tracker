import { Controller, Get, Query, Res } from '@nestjs/common';
import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';
import { Response } from 'express';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async getResponse(@Query() queries: ProxyQueriesDto) {
    return this.proxyService.getResponse(queries.url);
  }

  @Get('image')
  async getImage(@Res() res: Response, @Query() queries: ProxyQueriesDto) {
    const { stream, contentType } = await this.proxyService.getImage(
      queries.url,
    );

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'filename=image.jpg');

    return stream.getStream().pipe(res);
  }
}
