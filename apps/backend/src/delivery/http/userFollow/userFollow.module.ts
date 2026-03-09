import { Module } from "@nestjs/common"
import { UserFollowController } from "@/delivery/http/userFollow/userFollow.controller"
import { UserFollowServiceModule } from "@/services/userFollow/userFollow.module"

@Module({
  imports: [UserFollowServiceModule],
  controllers: [UserFollowController],
})
export class UserFollowHttpModule {}
