import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UserBansServiceModule } from "@/services/userBans/userBans.module"
import { UsersService } from "@/services/users/users.service"

@Module({
  imports: [UserBansServiceModule],
  providers: [
    UsersService,
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
  ],
  exports: [UsersService],
})
export class UsersServiceModule {}
