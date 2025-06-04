import { parentPort } from "node:worker_threads"
import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service"
import { ConfigService } from "@nestjs/config"
import "dotenv/config"

const configService = new ConfigService()
let generateDetailsSitemapService = new GenerateDetailsSitemapService(
  configService,
)

parentPort.on("message", async (message) => {
  if (message === "generate") {
    await generateDetailsSitemapService.generate()
    generateDetailsSitemapService = new GenerateDetailsSitemapService(
      configService,
    )
  }
})
