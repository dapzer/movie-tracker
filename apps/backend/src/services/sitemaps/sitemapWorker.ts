import { parentPort } from "node:worker_threads"
import { ConfigService } from "@nestjs/config"
import { GenerateDetailsSitemapsService } from "@/services/sitemaps/generateDetailsSitemap/generateDetailsSitemap.service"
import "dotenv/config"

const configService = new ConfigService()
let generateDetailsSitemapsService = new GenerateDetailsSitemapsService(
  configService,
)

parentPort.on("message", async (message) => {
  if (message === "generate") {
    await generateDetailsSitemapsService.generate()
    generateDetailsSitemapsService = new GenerateDetailsSitemapsService(
      configService,
    )
  }
})
