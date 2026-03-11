import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { DrizzleUserFollowRepository } from "@/repositories/userFollow/DrizzleUserFollowRepository"
import { UserFollowRepositorySymbol } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { NotificationsServiceModule } from "@/services/notifications/notifications.module"
import { UserFollowsService } from "@/services/userFollows/userFollows.service"

@Module({
  imports: [NotificationsServiceModule],
  providers: [
    UserFollowsService,
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
    { provide: UserFollowRepositorySymbol, useClass: DrizzleUserFollowRepository },
  ],
  exports: [UserFollowsService],
})
export class UserFollowsServiceModule {}
