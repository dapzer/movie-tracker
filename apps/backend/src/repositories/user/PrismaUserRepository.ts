import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@/repositories/user/UserRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import { UserRoleEnum, UserType } from '@movie-tracker/types';
import { User } from '@movie-tracker/database';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertToInterface(user: User): UserType {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      roles: user.roles.map((el) => UserRoleEnum[el]),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return this.convertToInterface(user);
  }

  async createUser(body: Pick<UserType, 'email' | 'name' | 'image'>) {
    const user = await this.prisma.user.create({ data: body });

    return this.convertToInterface(user);
  }

  async updateUser(
    id: string,
    body: Partial<Pick<UserType, 'name' | 'image'>>,
  ) {
    const user = await this.prisma.user.update({ where: { id }, data: body });

    return this.convertToInterface(user);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });

    return this.convertToInterface(user);
  }
}
