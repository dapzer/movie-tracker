import { MediaListAccessLevelEnum, User } from "@movie-tracker/database"
import { SignUpMethodEnum, UserMediaRatingsAccessLevelEnum, UserRoleEnum, UserType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { UserRepositoryInterface } from "@/repositories/user/UserRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

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

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    return this.convertToInterface(user)
  }

  async getStatsById(id: string) {
    const [mediaListCount, mediaRatingsCount, mediaListLikeCount] = await Promise.all([
      this.prisma.mediaList.count({ where: { userId: id, accessLevel: MediaListAccessLevelEnum.PUBLIC } }),
      this.prisma.mediaRating.count({ where: { userId: id } }),
      this.prisma.mediaListLike.count({ where: { userId: id } }),
    ])

    return { mediaListCount, mediaRatingsCount, mediaListLikeCount }
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    return this.convertToInterface(user)
  }

  async create(args: Parameters<UserRepositoryInterface["create"]>[0]) {
    const user = await this.prisma.user.create({ data: args.body })

    return this.convertToInterface(user)
  }

  async update(args: Parameters<UserRepositoryInterface["update"]>[0]) {
    const user = await this.prisma.user.update({ where: { id: args.id }, data: args.body })

    return this.convertToInterface(user)
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({ where: { id } })

    return this.convertToInterface(user)
  }

  async getCount() {
    return this.prisma.user.count()
  }
}
