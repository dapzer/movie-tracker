import { UserRoleEnum } from "@movie-tracker/types"
import { Controller, Get, Header, Param, Post, Req, StreamableFile, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { RolesWithDocs } from "@/decorators/rolesWithDocs.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { SitemapsService } from "@/services/sitemaps/sitemaps.service"

@Controller("sitemaps")
export class SitemapsController {
  constructor(private readonly sitemapsService: SitemapsService) {}

  @Get(":domain/:folder/:language/:fileName")
  @Header("Content-Type", "application/xml")
  async getSitemapFile(
    @Param("domain") domain: string,
    @Param("folder") folder: string,
    @Param("language") language: string,
    @Param("fileName") fileName: string,
    @Req() req: Request,
  ) {
    const fileLocation = `${domain}/${folder}/${language}/${fileName}`
    const stream = await this.sitemapsService.readFile(fileLocation)

    req.on("close", () => {
      stream.destroy()
    })

    return new StreamableFile(stream)
  }

  @Post("generate")
  @UseGuards(AuthGuard)
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async triggerGeneration() {
    return this.sitemapsService.generate()
  }
}
