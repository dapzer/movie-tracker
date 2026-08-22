import { dataImports } from "@movie-tracker/database"
import { desc, eq } from "@movie-tracker/database/drizzle"
import {
  DataImportListItemType,
  DataImportSourceEnum,
  DataImportStatusEnum,
  DataImportType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count } from "drizzle-orm"
import { DataImportRepositoryInterface } from "@/repositories/dataImport/DataImportRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type DataImportRow = typeof dataImports.$inferSelect
type DataImportListItemRow = Omit<DataImportRow, "result">

@Injectable()
export class DrizzleDataImportRepository implements DataImportRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(row: DataImportRow): DataImportType {
    return {
      ...this.convertToListItemInterface(row),
      result: row.result,
    }
  }

  private convertToListItemInterface(row: DataImportListItemRow): DataImportListItemType {
    return {
      id: row.id,
      userId: row.userId,
      source: DataImportSourceEnum[row.source.toUpperCase() as keyof typeof DataImportSourceEnum],
      status: DataImportStatusEnum[row.status],
      processedAt: row.processedAt ?? undefined,
      createdAt: row.createdAt,
    }
  }

  async create(args: Parameters<DataImportRepositoryInterface["create"]>[0]) {
    const [dataImport] = await this.drizzle.client
      .insert(dataImports)
      .values({
        userId: args.userId,
        source: args.source,
        result: args.result,
      })
      .returning()

    return this.convertToInterface(dataImport)
  }

  async getById(args: Parameters<DataImportRepositoryInterface["getById"]>[0]) {
    const [row] = await this.drizzle.client
      .select()
      .from(dataImports)
      .where(eq(dataImports.id, args.id))
      .limit(1)

    return row ? this.convertToInterface(row) : undefined
  }

  async getByUserId(args: Parameters<DataImportRepositoryInterface["getByUserId"]>[0]) {
    const [items, totalCount] = await Promise.all([
      this.drizzle.client
        .select({
          id: dataImports.id,
          userId: dataImports.userId,
          source: dataImports.source,
          status: dataImports.status,
          processedAt: dataImports.processedAt,
          createdAt: dataImports.createdAt,
        })
        .from(dataImports)
        .where(eq(dataImports.userId, args.userId))
        .orderBy(desc(dataImports.createdAt))
        .limit(args.limit)
        .offset(args.offset),
      this.drizzle.client
        .select({ count: count() })
        .from(dataImports)
        .where(eq(dataImports.userId, args.userId)),
    ])

    return {
      items: items.map(item => this.convertToListItemInterface(item)),
      totalCount: Number(totalCount[0]?.count ?? 0),
    }
  }

  async updateStatus(args: Parameters<DataImportRepositoryInterface["updateStatus"]>[0]) {
    const [dataImport] = await this.drizzle.client
      .update(dataImports)
      .set({
        status: args.status,
        processedAt: args.processedAt,
      })
      .where(eq(dataImports.id, args.id))
      .returning()

    return this.convertToInterface(dataImport)
  }
}
