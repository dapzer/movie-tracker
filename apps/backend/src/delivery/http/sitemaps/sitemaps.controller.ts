import { UserRoleEnum } from "@movie-tracker/types"
import { Controller, Get, Header, Param, Post, Req, StreamableFile, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { Roles } from "@/decorators/roles.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { SitemapsService } from "@/services/sitemaps/sitemaps.service"

@Controller("sitemaps")
export class SitemapsController {
  constructor(private readonly sitemapsService: SitemapsService) {}

  @Get(":folder/:subFolder/:fileName")
  @Header("Content-Type", "application/xml")
  async getSitemapFile(
    @Param("fileName") fileName: string,
    @Param("subFolder") subFolder: string,
    @Req() req: Request,
    @Param("folder") folder: string,
  ) {
    const fileLocation = `${folder}/${subFolder}/${fileName}`
    const stream = await this.sitemapsService.readFile(fileLocation)

    req.on("close", () => {
      stream.destroy()
    })

    return new StreamableFile(stream)
  }

  @Post("generate")
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async triggerGeneration() {
    return this.sitemapsService.generate()
  }
}
