import { Controller, Get, Header, Query, StreamableFile } from "@nestjs/common"
import { GetOpenGraphImageDto } from "@/services/openGraphImages/dto/getOpenGraphImage.dto"
import { OpenGraphImagesService } from "@/services/openGraphImages/openGraphImages.service"
import { GetOpenGraphImageDocs, OpenGraphImagesControllerDocs } from "./openGraphImages.controller.docs"

@OpenGraphImagesControllerDocs()
@Controller("open-graph-images")
export class OpenGraphImagesController {
  constructor(private readonly openGraphImagesService: OpenGraphImagesService) {}

  @Get("")
  @Header("Content-Type", "image/webp")
  @GetOpenGraphImageDocs()
  async getOpenGraphImage(@Query() queries: GetOpenGraphImageDto) {
    const image = await this.openGraphImagesService.get(
      queries.title,
      queries.imageUrl,
      queries.isAvatarPlaceholder,
    )

    return new StreamableFile(new Uint8Array(image))
  }
}
