import { applyDecorators } from "@nestjs/common"
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function OpenGraphImagesControllerDocs() {
  return applyDecorators(ApiTags("Open Graph Images"))
}

export function GetOpenGraphImageDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Generate open graph image" }),
    ApiOkResponse({
      description: "Generated open graph image",
      content: { "image/webp": { schema: { type: "string", format: "binary" } } },
    }),
    ApiInternalServerErrorResponse({ description: "Failed to generate image", type: ErrorResponseDto }),
  )
}
