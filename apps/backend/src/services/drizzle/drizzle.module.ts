import * as schema from "@movie-tracker/database/drizzle"
import { drizzle } from "@movie-tracker/database/drizzle"
import { Global, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Pool } from "pg"
import { DRIZZLE_CLIENT } from "@/services/drizzle/drizzle.tokens"
import { DrizzleService } from "./drizzle.service"

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get<string>("DATABASE_URL"),
        })
        return drizzle({ client: pool, schema })
      },
    },
    DrizzleService,
  ],
  exports: [DrizzleService],
})
export class DrizzleModule {}
