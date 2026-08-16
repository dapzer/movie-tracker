import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function DataImportControllerDocs() {
  return applyDecorators(ApiTags("Data Import"))
}

export function ImportDataDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Import data from external source archive" }),
    ApiSecurity("cookie"),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: ["archive"],
        properties: {
          archive: {
            type: "string",
            format: "binary",
            description: "Zip archive exported from the source service",
          },
        },
      },
    }),
    ApiOkResponse({ description: "Data imported successfully" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to import data", type: ErrorResponseDto }),
  )
}
