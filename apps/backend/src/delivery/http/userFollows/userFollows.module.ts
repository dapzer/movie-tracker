import { Module } from "@nestjs/common"
import { UserFollowsController } from "@/delivery/http/userFollows/userFollows.controller"
import { UserFollowsServiceModule } from "@/services/userFollows/userFollows.module"

@Module({
  imports: [UserFollowsServiceModule],
  controllers: [UserFollowsController],
})
export class UserFollowsModule {}
