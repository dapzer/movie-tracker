import { Controller, Get, Header, Query, StreamableFile, } from '@nestjs/common';
import { OpenGraphImageService } from '@/routes/openGraphImage/openGraphImage.service';
import { GetOpenGraphImageDto } from '@/routes/openGraphImage/dto/getOpenGraphImage.dto';

@Controller('open-graph-image')
export class OpenGraphImageController {
  constructor(private readonly openGraphImageService: OpenGraphImageService) {}

  @Get('')
  @Header('Content-Type', 'image/webp')
  async getOpenGraphImage(@Query() queries: GetOpenGraphImageDto) {
    const image = await this.openGraphImageService.getOpenGraphImage(
      queries.title,
      queries.imageUrl,
      queries.isAvatarPlaceholder,
    );

    return new StreamableFile(image);
  }
}
