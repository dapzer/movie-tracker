import { PrismaService } from "@/services/prisma/prisma.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
