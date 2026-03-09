import type * as schema from "@movie-tracker/database/drizzle"
import type { NodePgDatabase } from "@movie-tracker/database/drizzle"
import { Inject, Injectable } from "@nestjs/common"
import { DRIZZLE_CLIENT } from "@/services/drizzle/drizzle.tokens"

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    public readonly client: NodePgDatabase<typeof schema>,
  ) {
  }
}
