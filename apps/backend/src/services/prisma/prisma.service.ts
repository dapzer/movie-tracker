import { PrismaClient } from "@movie-tracker/database"
import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaPg } from "@prisma/adapter-pg"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({ connectionString: configService.get("DATABASE_URL") })
    super({
      adapter,
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
