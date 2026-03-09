import { Module } from "@nestjs/common"
import { UserController } from "@/delivery/http/user/user.controller"
import { UserServiceModule } from "@/services/user/user.module"

@Module({
  imports: [UserServiceModule],
  controllers: [UserController],
})
export class UserHttpModule {}
