import { Buffer } from "node:buffer"
import { Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import {
  DataImportControllerDocs,
  GetDataImportByIdDocs,
  GetDataImportsDocs,
  ImportDataDocs,
} from "@/delivery/http/dataImport/dataImport.controller.docs"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { ImportDataQueryDto } from "@/services/dataImport/dto/importDataQuery.dto"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { DataImportArchiveIsRequiredError } from "@/shared/errors/dataImport"

@Controller("data-import")
@DataImportControllerDocs()
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @Post()
  @ImportDataDocs()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("archive"))
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
}
