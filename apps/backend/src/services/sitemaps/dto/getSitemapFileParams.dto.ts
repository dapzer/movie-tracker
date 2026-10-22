import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const sitemapPathSegmentSchema = z.string().regex(
  /^[\w-]+(\.[\w-]+)*$/,
  "Invalid sitemap path segment",
)

const getSitemapFileParamsSchema = z.object({
  domain: sitemapPathSegmentSchema.meta({ example: "details" }),
  folder: sitemapPathSegmentSchema.meta({ example: "movie" }),
  language: sitemapPathSegmentSchema.meta({ example: "en" }),
  fileName: sitemapPathSegmentSchema.meta({ example: "sitemap-0.xml" }),
})

export class GetSitemapFileParamsDto extends createZodDto(getSitemapFileParamsSchema) {}
