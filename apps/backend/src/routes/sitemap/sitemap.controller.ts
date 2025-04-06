import { Roles } from "@/decorators/roles.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { SitemapService } from "@/routes/sitemap/sitemap.service"
import { UserRoleEnum } from "@movie-tracker/types"
import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from "@nestjs/common"

@Controller("sitemaps")
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get(":folder/:subFolder/:fileName")
  @Header("Content-Type", "application/xml")
  async getSitemapFile(
    @Param("fileName") fileName: string,
    @Param("subFolder") subFolder: string,
    @Param("folder") folder: string,
  ) {
    const fileLocation = `${folder}/${subFolder}/${fileName}`
    const stream = await this.sitemapService.readFile(fileLocation)

    return new StreamableFile(stream)
  }

  @Post("generate")
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async triggerGeneration() {
    return this.sitemapService.generate()
  }
}
