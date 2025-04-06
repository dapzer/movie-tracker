import { PrismaUserRepository } from "@/repositories/user/PrismaUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
