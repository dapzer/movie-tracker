import { createReadStream, statSync } from "node:fs"
import { resolve, sep } from "node:path"
import * as process from "node:process"
import { Worker } from "node:worker_threads"
import { getMillisecondsFromDays } from "@movie-tracker/utils"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Interval } from "@nestjs/schedule"
import { SitemapFileNotFoundError, SitemapPathAccessDeniedError } from "@/shared/errors/sitemap"

@Injectable()
export class SitemapsService {
  worker = new Worker(resolve(__dirname, "sitemapWorker.js"))

  constructor(private readonly configService: ConfigService) {}

  @Interval(getMillisecondsFromDays(7))
  autoGenerate() {
    if (this.configService.get("GENERATE_SITEMAP") === "true") {
      this.generate()
    }
  }

  async generate() {
    this.worker.postMessage("generate")
  }

  async readFile(fileLocation: string) {
    const baseDir = resolve(process.cwd(), "sitemaps")
    const filePath = resolve(baseDir, fileLocation)

    if (!filePath.startsWith(baseDir + sep)) {
      throw new SitemapPathAccessDeniedError({ fileLocation })
    }

    try {
      statSync(filePath)

      return createReadStream(filePath)
    }
    catch (error) {
      throw new SitemapFileNotFoundError({ fileLocation, cause: error })
    }
  }
}
