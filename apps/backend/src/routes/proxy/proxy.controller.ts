import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';

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
  async getResizedImage(
    @Res() response: Response,
    @Param('everything') everything: string,
    @Query() queries: Record<string, string>,
  ) {
    const { res, contentType } = await this.proxyService.getResponse(
      everything,
      queries,
    );

    response.header('Content-Type', contentType);
    response.send(res);
  }
}
