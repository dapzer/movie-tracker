import { Controller, Get, Header, Query, StreamableFile } from "@nestjs/common"
import { GetOpenGraphImageDto } from "@/routes/openGraphImage/dto/getOpenGraphImage.dto"
import { OpenGraphImageService } from "@/routes/openGraphImage/openGraphImage.service"

@Controller("open-graph-image")
export class OpenGraphImageController {
  constructor(private readonly openGraphImageService: OpenGraphImageService) {}

  @Get("")
  @Header("Content-Type", "image/webp")
  async getOpenGraphImage(@Query() queries: GetOpenGraphImageDto) {
    const image = await this.openGraphImageService.get(
      queries.title,
      queries.imageUrl,
      queries.isAvatarPlaceholder,
    )

    return new StreamableFile(new Uint8Array(image))
  }
}
