import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { DrizzleUserFollowRepository } from "@/repositories/userFollow/DrizzleUserFollowRepository"
import { UserFollowRepositorySymbol } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { NotificationServiceModule } from "@/services/notification/notification.module"
import { UserFollowService } from "@/services/userFollow/userFollow.service"

@Module({
  imports: [NotificationServiceModule],
  providers: [
    UserFollowService,
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
    { provide: UserFollowRepositorySymbol, useClass: DrizzleUserFollowRepository },
  ],
  exports: [UserFollowService],
})
export class UserFollowServiceModule {}
