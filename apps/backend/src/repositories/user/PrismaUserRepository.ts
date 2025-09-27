import { User } from "@movie-tracker/database"
import { SignUpMethodEnum, UserMediaRatingsAccessLevelEnum, UserRoleEnum, UserType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { UserRepositoryInterface } from "@/repositories/user/UserRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
  }

  private convertToInterface(user: User | null): UserType | null {
    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      signUpMethod: SignUpMethodEnum[user.signUpMethod],
      isEmailVerified: user.isEmailVerified,
      password: user.password,
      roles: user.roles.map(el => UserRoleEnum[el]),
      mediaRatingsAccessLevel: UserMediaRatingsAccessLevelEnum[user.mediaRatingsAccessLevel],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    return this.convertToInterface(user)
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    return this.convertToInterface(user)
  }

  async createUser(
    body: Pick<
      UserType,
      "email" | "name" | "image" | "password" | "isEmailVerified" | "signUpMethod"
    >,
  ) {
    const user = await this.prisma.user.create({ data: body })

    return this.convertToInterface(user)
  }

  async updateUser(
    id: string,
    body: Partial<Pick<UserType, "name" | "image" | "isEmailVerified" | "password" | "email" | "mediaRatingsAccessLevel">>,
  ) {
    const user = await this.prisma.user.update({ where: { id }, data: body })

    return this.convertToInterface(user)
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({ where: { id } })

    return this.convertToInterface(user)
  }

  async getUsersCount() {
    return this.prisma.user.count()
  }
}
