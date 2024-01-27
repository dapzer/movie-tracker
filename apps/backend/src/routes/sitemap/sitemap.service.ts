import { HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service";
import { join } from "path";
import { createReadStream, statSync } from "fs";
import { createGunzip } from "zlib";
import { ConfigService } from "@nestjs/config";
import { Interval } from "@nestjs/schedule";
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours";

@Injectable()
export class SitemapService implements OnModuleInit {
  constructor(private readonly generateDetailsSitemapService: GenerateDetailsSitemapService, private readonly configService: ConfigService) {
  }

  onModuleInit() {
    if (this.configService.get("GENERATE_SITEMAP") === "true") {
      this.generate();
    }
  }

  @Interval(getMillisecondsFromHours(24))
  autoGenerate() {
    if (this.configService.get("GENERATE_SITEMAP") === "true") {
      this.generate();
    }
  }

  async generate() {
    return this.generateDetailsSitemapService.generate();
  }

  async readFile(fileLocation: string) {
    try {
      const filePath = join(process.cwd(), "sitemaps", fileLocation);

      statSync(filePath);

      const file = createReadStream(filePath);
      const gunzip = createGunzip();

      return file.pipe(gunzip);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new HttpException("Not found", HttpStatus.NOT_FOUND);
      } else {
        throw error;
      }
    }
  }
}
