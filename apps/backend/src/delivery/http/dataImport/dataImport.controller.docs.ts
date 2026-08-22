import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { DataImportDto, DataImportsPaginatedDto, ImportDataResponseDto, ProcessDataImportResponseDto } from "@/services/dataImport/dto/dataImport.dto"
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
    ApiOkResponse({ description: "Data imported successfully", type: ImportDataResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to import data", type: ErrorResponseDto }),
  )
}

export function GetDataImportsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get data imports history" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Data imports history", type: DataImportsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to get data imports", type: ErrorResponseDto }),
  )
}

export function GetDataImportByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get data import by id" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Data import details", type: DataImportDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Data import not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to get data import", type: ErrorResponseDto }),
  )
}

export function ProcessDataImportDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Process data import into media lists and media items" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Data import processed successfully", type: ProcessDataImportResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Data import not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to process data import", type: ErrorResponseDto }),
  )
}
