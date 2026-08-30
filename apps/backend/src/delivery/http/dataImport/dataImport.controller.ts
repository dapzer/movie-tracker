import { Buffer } from "node:buffer"
import { getBytesFromMegabytes, getMillisecondsFromMins } from "@movie-tracker/utils"
import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Throttle } from "@nestjs/throttler"
import {
  DataImportControllerDocs,
  GetDataImportByIdDocs,
  GetDataImportsDocs,
  ImportDataDocs,
  ProcessDataImportDocs,
} from "@/delivery/http/dataImport/dataImport.controller.docs"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { ImportDataQueryDto } from "@/services/dataImport/dto/importDataQuery.dto"
import { ProcessDataImportDto } from "@/services/dataImport/dto/processDataImport.dto"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { DataImportArchiveIsRequiredError } from "@/shared/errors/dataImport"

const IMPORT_ARCHIVE_MAX_SIZE_BYTES = getBytesFromMegabytes(50)

@Controller("data-import")
@DataImportControllerDocs()
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @Post()
  @ImportDataDocs()
  @Throttle({
    default: {
      limit: 3,
      ttl: getMillisecondsFromMins(15),
    },
  })
  @UseGuards(AuthGuard, ThrottlerBehindProxyGuard)
  @UseInterceptors(FileInterceptor("archive", { limits: { fileSize: IMPORT_ARCHIVE_MAX_SIZE_BYTES } }))
  async importData(
    @Query() query: ImportDataQueryDto,
    @User() user: UserDto,
    @UploadedFile() file?: { buffer: Buffer },
  ) {
    if (!file) {
      throw new DataImportArchiveIsRequiredError()
    }

    return this.dataImportService.import({
      userId: user.id,
      source: query.source,
      archive: file.buffer,
    })
  }

  @Get()
  @GetDataImportsDocs()
  @UseGuards(AuthGuard)
  async getDataImports(
    @Query() query: PaginationDto,
    @User() user: UserDto,
  ) {
    return this.dataImportService.getByUserId({
      userId: user.id,
      limit: query.limit,
      offset: query.offset,
    })
  }

  @Get(":id")
  @GetDataImportByIdDocs()
  @UseGuards(AuthGuard)
  async getDataImportById(
    @Param() params: UuidDto,
    @User() user: UserDto,
  ) {
    return this.dataImportService.getById({ id: params.id, userId: user.id })
  }

  @Post(":id/process")
  @ProcessDataImportDocs()
  @Throttle({
    default: {
      limit: 5,
      ttl: getMillisecondsFromMins(15),
    },
  })
  @UseGuards(AuthGuard, ThrottlerBehindProxyGuard)
  async processDataImport(
    @Param() params: UuidDto,
    @Body() body: ProcessDataImportDto,
    @User() user: UserDto,
  ) {
    return this.dataImportService.process({ id: params.id, userId: user.id, config: body })
  }
}
