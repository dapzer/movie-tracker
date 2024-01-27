import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { SitemapService } from "@/routes/sitemap/sitemap.service";
import { AuthGuard } from "@/routes/auth/guards/auth.guard";
import { Roles } from "@/decorators/roles.decorator";
import { RolesGuard } from "@/guards/roles.guard";
import { UserRoleEnum } from "@movie-tracker/types";

@Controller("sitemaps")
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {
  }

  @Get(":folder/:subFolder/:fileName")
  async getSitemapFile(@Param("fileName") fileName: string,
                       @Param("subFolder") subFolder: string,
                       @Param("folder") folder: string,
                       @Req() req: Request,
                       @Res() res: Response) {
    const fileLocation = `${folder}/${subFolder}/${fileName}`;
    const stream = await this.sitemapService.readFile(fileLocation);
    res.header("Content-Type", "application/xml");

    return stream.pipe(res);
  }

  @Post("generate")
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async triggerGeneration() {
    return this.sitemapService.generate();
  }
}
