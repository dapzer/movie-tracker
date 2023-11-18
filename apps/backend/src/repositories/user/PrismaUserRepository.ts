import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@/repositories/user/UserRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import { UserDto } from '@/routes/auth/dto/user.dto';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(body: Pick<UserDto, 'email' | 'name' | 'image'>) {
    return this.prisma.user.create({ data: body });
  }

  async updateUser(id: string, body: Partial<Pick<UserDto, 'name' | 'image'>>) {
    return this.prisma.user.update({ where: { id }, data: body });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
