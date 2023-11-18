import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositorySymbol } from '@/repositories/user/UserRepositoryInterface';
import { PrismaUserRepository } from '@/repositories/user/PrismaUserRepository';

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
