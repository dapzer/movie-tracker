import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from '@/routes/sitemap/sitemap.service';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { UserRoleEnum } from '@movie-tracker/types';

@Controller('sitemaps')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get(':folder/:subFolder/:fileName')
  async getSitemapFile(
    @Param('fileName') fileName: string,
    @Param('subFolder') subFolder: string,
    @Param('folder') folder: string,
    @Res() res: Response,
  ) {
    const fileLocation = `${folder}/${subFolder}/${fileName}`;
    const stream = await this.sitemapService.readFile(fileLocation);
    res.header('Content-Type', 'application/xml');

    try {
      return new Promise((resolve, reject) => {
        stream
          .on('error', (error) => {
            stream.destroy();
            reject(error);
          })
          .pipe(res)
          .on('finish', () => {
            stream.destroy();
            resolve(null);
          });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('generate')
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async triggerGeneration() {
    return this.sitemapService.generate();
  }
}
