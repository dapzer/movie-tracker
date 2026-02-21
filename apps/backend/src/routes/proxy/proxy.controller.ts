import { CacheInterceptor } from "@nestjs/cache-manager"
import { Controller, Get, Param, Query, Req, Res, UseInterceptors } from "@nestjs/common"
import { Request, Response } from "express"
import { ProxyQueriesDto } from "@/routes/proxy/dto/proxyQueries..dto"
import { ProxyService } from "@/routes/proxy/proxy.service"

@Controller("proxy")
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get("image/*everything")
  async getImage(
    @Query() queries: ProxyQueriesDto,
    @Res() res: Response,
    @Req() req: Request,
    @Param("everything") everything: string,
  ) {
    const { stream, contentType } = await this.proxyService.getImage(
      everything.replace(/,/g, "/"),
      queries.keepOriginalType,
      queries.size,
    )
    req.on("close", () => {
      stream.destroy()
    })
    res.header("Content-Type", contentType)

    stream.pipe(res)
  }

  @Get("content/*everything")
  @UseInterceptors(CacheInterceptor)
  async getResizedImage(
    @Param("everything") everything: string,
    @Query() queries: Record<string, string>,
  ) {
    return this.proxyService.getData(everything.replace(/,/g, "/"), queries)
  }
}
