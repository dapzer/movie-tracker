import type * as schema from "@movie-tracker/database/drizzle"
import type { NodePgDatabase } from "@movie-tracker/database/drizzle"
import { AsyncLocalStorage } from "node:async_hooks"
import { Inject, Injectable } from "@nestjs/common"
import { DRIZZLE_CLIENT } from "@/services/drizzle/drizzle.tokens"

export type DrizzleTransaction = Parameters<Parameters<NodePgDatabase<typeof schema>["transaction"]>[0]>[0]

@Injectable()
export class DrizzleService {
  private readonly transactionStorage = new AsyncLocalStorage<{ tx: DrizzleTransaction }>()

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly dbClient: NodePgDatabase<typeof schema>,
  ) {
  }

  get client(): NodePgDatabase<typeof schema> {
    return (this.transactionStorage.getStore()?.tx ?? this.dbClient) as NodePgDatabase<typeof schema>
  }

  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    if (this.transactionStorage.getStore()) {
      return fn()
    }

    return this.dbClient.transaction(tx => this.transactionStorage.run({ tx }, fn))
  }
}
