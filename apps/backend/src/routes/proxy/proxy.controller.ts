import { CacheInterceptor } from "@nestjs/cache-manager"
import { Controller, Get, Param, Query, Res, UseInterceptors } from "@nestjs/common"
import { Response } from "express"
import { ProxyQueriesDto } from "@/routes/proxy/dto/proxyQueries..dto"
import { ProxyService } from "@/routes/proxy/proxy.service"

@Controller("proxy")
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get("image/*everything")
  async getImage(
    @Query() queries: ProxyQueriesDto,
    @Res() res: Response,
    @Param("everything") everything: string,
  ) {
    const { stream, contentType } = await this.proxyService.getImage(
      everything,
      queries.keepOriginalType,
      queries.size,
    )
    res.header("Content-Type", contentType)

    stream.pipe(res)
  }

  @Get("content/*everything")
  @UseInterceptors(CacheInterceptor)
  async getResizedImage(
    @Param("everything") everything: string,
    @Query() queries: Record<string, string>,
  ) {
    return this.proxyService.getResponse(everything, queries)
  }
}
