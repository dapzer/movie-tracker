import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('image/:everything(*)')
  async getImage(
    @Query() queries: ProxyQueriesDto,
    @Res() res: Response,
    @Param('everything') everything: string,
  ) {
    const image = await this.proxyService.getImage(everything, queries.size);
    res.header('Content-Type', 'image/webp');

    image.pipe(res);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('content/:everything(*)')
  async getResizedImage(
    @Param('everything') everything: string,
    @Query() queries: Record<string, string>,
  ) {
    return this.proxyService.getResponse(everything, queries);
  }
}
