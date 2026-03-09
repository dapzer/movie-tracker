import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { DrizzleUserFollowRepository } from "@/repositories/userFollow/DrizzleUserFollowRepository"
import { UserFollowRepositorySymbol } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { NotificationModule } from "@/routes/notification/notification.module"
import { UserFollowController } from "@/routes/userFollow/userFollow.controller"
import { UserFollowService } from "@/routes/userFollow/userFollow.service"

@Module({
  imports: [NotificationModule],
  controllers: [UserFollowController],
  providers: [
    UserFollowService,
    {
      provide: UserRepositorySymbol,
      useClass: DrizzleUserRepository,
    },
    {
      provide: UserFollowRepositorySymbol,
      useClass: DrizzleUserFollowRepository,
    },
  ],
})
export class UserFollowModule {}
