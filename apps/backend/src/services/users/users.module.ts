import { Module } from "@nestjs/common"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { UsersService } from "@/services/users/users.service"

@Module({
  providers: [
    UsersService,
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
  ],
  exports: [UsersService],
})
export class UsersServiceModule {}
