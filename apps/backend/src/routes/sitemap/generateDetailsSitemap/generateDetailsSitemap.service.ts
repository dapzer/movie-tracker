import * as fs from "node:fs/promises"
import { resolve } from "node:path"
import * as process from "node:process"
import { promisify } from "node:util"
import { unzip } from "node:zlib"
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EnumChangefreq, simpleSitemapAndIndex, SitemapItemLoose } from "sitemap"

const unzipAsync = promisify(unzip)
const idRegex = /"id":(\d+)/g

@Injectable()
export class GenerateDetailsSitemapService {
  private readonly logger = new Logger("GenerateDetailsSitemapService")
  private readonly mediaTypes = [
    {
      type: "movie",
      fileMame: "movie",
    },
    {
      type: "tv",
      fileMame: "tv_series",
    },
    {
      type: "person",
      fileMame: "person",
    },
  ]

  constructor(private readonly configService: ConfigService) {}

  private formatDate(dayBeforeToday: number = 0): string {
    const dateNow = new Date()
    const date = new Date(dateNow.setDate(dateNow.getDate() - dayBeforeToday))
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${month}_${day}_${year}`
  }

  private getLastModifiedDate(): string {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")

    // UTC to match common expectations + no ms
    const year = now.getUTCFullYear()
    const month = pad(now.getUTCMonth() + 1)
    const day = pad(now.getUTCDate())
    const hour = pad(now.getUTCHours())
    const minute = pad(now.getUTCMinutes())
    const second = pad(now.getUTCSeconds())

    return `${year}-${month}-${day}T${hour}:${minute}:${second}+00:00`
  }

  private async getSourceData(baseFileName: string) {
    let tryCount = 0

    while (tryCount < 7) {
      const fileName = `${baseFileName}_ids_${this.formatDate(
        tryCount,
      )}.json.gz`

      const response = await fetch(
        `${this.configService.get("TMDB_FILES_API_URL")}/${fileName}`,
      )

      if (response.ok) {
        return response
      }
      tryCount = tryCount + 1
    }

    throw new HttpException(
      `Failed to get data from TMDB.`,
      HttpStatus.BAD_GATEWAY,
    )
  }

  private async clearSitemapFolder() {
    try {
      const dirPath = resolve(process.cwd(), "sitemaps", "details")
      await fs.rm(dirPath, { force: true, recursive: true })
    }
    catch (error) {
      this.logger.error("Failed to clear sitemap folder.", error)
    }
  }

  async generate() {
    // const modifiedDate = this.getLastModifiedDate()

    for (const mediaType of this.mediaTypes) {
      const data = await this.getSourceData(mediaType.fileMame)

      const body = await data.arrayBuffer()
      const unzippedData = await unzipAsync(body)
      const parsedData = unzippedData.toString()

      const matches = parsedData.matchAll(idRegex)
      let sitemapItems: SitemapItemLoose[] = []

      for (const match of matches) {
        const id = match[1]

        sitemapItems.push({
          url: `/details/${mediaType.type}/${id}`,
          links: [
            {
              lang: "ru",
              url: `/details/${mediaType.type}/${id}`,
            },
            {
              lang: "en",
              url: `/en/details/${mediaType.type}/${id}`,
            },
          ],
          changefreq: EnumChangefreq.DAILY,
          // lastmod: modifiedDate,
          priority: 0.6,
        })
      }

      this.logger.log(
        `Start generate sitemap for ${mediaType.type}. Link count: ${sitemapItems.length}.`,
      )
      await simpleSitemapAndIndex({
        limit: 25000,
        hostname: this.configService.get("CLIENT_BASE_URL"),
        sitemapHostname: `${this.configService.get("CLIENT_BASE_URL")}/sitemaps/details/${mediaType.type}/`,
        destinationDir: `./sitemaps/details/${mediaType.type}/`,
        sourceData: sitemapItems,
      })
        .then(() => {
          this.logger.log(`Finish generate sitemap for ${mediaType.type}!`)
        })
        .catch(() => {
          this.logger.error(
            `Failed to generate sitemap for ${mediaType.type}!`,
          )
        })
        .finally(
          () => {
            sitemapItems = []
          },
        )
    }
  }
}
