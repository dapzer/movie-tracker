import { Module } from "@nestjs/common"
import { DrizzleUserBanRepository } from "@/repositories/userBan/DrizzleUserBanRepository"
import { UserBanRepositorySymbol } from "@/repositories/userBan/UserBanRepositoryInterface"
import { NotificationsServiceModule } from "@/services/notifications/notifications.module"
import { UserBansService } from "@/services/userBans/userBans.service"

@Module({
  imports: [NotificationsServiceModule],
  providers: [
    UserBansService,
    { provide: UserBanRepositorySymbol, useClass: DrizzleUserBanRepository },
  ],
  exports: [UserBansService],
})
export class UserBansServiceModule {}
