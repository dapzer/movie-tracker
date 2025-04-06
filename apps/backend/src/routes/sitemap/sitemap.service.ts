import { createReadStream, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { Worker } from "node:worker_threads"
import { createGunzip } from "node:zlib"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Interval } from "@nestjs/schedule"

@Injectable()
export class SitemapService {
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
    try {
      const filePath = join(process.cwd(), "sitemaps", fileLocation)

      statSync(filePath)

      const file = createReadStream(filePath)
      const gunzip = createGunzip()

      return file.pipe(gunzip)
    }
    catch (error) {
      throw new HttpException(
        `File ${fileLocation} not found`,
        HttpStatus.NOT_FOUND,
      )
    }
  }
}
