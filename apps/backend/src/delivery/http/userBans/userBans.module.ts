import { Module } from "@nestjs/common"
import { UserBansController } from "@/delivery/http/userBans/userBans.controller"
import { UserBansServiceModule } from "@/services/userBans/userBans.module"

@Module({
  imports: [UserBansServiceModule],
  controllers: [UserBansController],
})
export class UserBansModule {}
