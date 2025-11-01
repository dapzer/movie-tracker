import { Module } from "@nestjs/common"
import { PrismaUserRepository } from "@/repositories/user/PrismaUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { PrismaUserFollowRepository } from "@/repositories/userFollow/PrismaUserFollowRepository"
import { UserFollowRepositorySymbol } from "@/repositories/userFollow/UserFollowRepositoryInterface"
import { UserFollowController } from "@/routes/userFollow/userFollow.controller"
import { UserFollowService } from "@/routes/userFollow/userFollow.service"

@Module({
  imports: [],
  controllers: [UserFollowController],
  providers: [
    UserFollowService,
    {
      provide: UserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
    {
      provide: UserFollowRepositorySymbol,
      useClass: PrismaUserFollowRepository,
    },
  ],
})
export class UserFollowModule {}
