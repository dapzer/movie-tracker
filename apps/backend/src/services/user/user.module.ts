import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UserService } from "@/services/user/user.service"

@Module({
  providers: [
    UserService,
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
  ],
  exports: [UserService],
})
export class UserServiceModule {}
