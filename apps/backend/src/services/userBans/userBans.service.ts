import { Inject, Injectable } from "@nestjs/common"
import {
  UserBanRepositoryInterface,
  UserBanRepositorySymbol,
} from "@/repositories/userBan/UserBanRepositoryInterface"
import { CreateUserBanDto } from "@/services/userBans/dto/createUserBan.dto"
import { GetUserBansQueryDto } from "@/services/userBans/dto/getUserBansQuery.dto"
import { UserBanNotFoundError } from "@/shared/errors/userBan"

@Injectable()
export class UserBansService {
  constructor(
    @Inject(UserBanRepositorySymbol)
    private readonly userBanRepository: UserBanRepositoryInterface,
  ) {}

  async getList(query: GetUserBansQueryDto) {
    return this.userBanRepository.getList(query)
  }

  async getById(id: string) {
    const userBan = await this.userBanRepository.getById({ id })

    if (!userBan) {
      throw new UserBanNotFoundError({ userBanId: id })
    }

    return userBan
  }

  async getByUserId(userId: string) {
    return this.userBanRepository.getByUserId({ userId })
  }

  async getActiveByUserId(userId: string) {
    return this.userBanRepository.getActiveByUserId({ userId })
  }

  async create(args: { body: CreateUserBanDto, currentUserId: string }) {
    return this.userBanRepository.create({
      ...args.body,
      issuedBy: args.currentUserId,
    })
  }

  async revoke(args: { id: string, currentUserId: string }) {
    const userBan = await this.userBanRepository.revoke({
      id: args.id,
      revokedBy: args.currentUserId,
    })

    if (!userBan) {
      throw new UserBanNotFoundError({ userBanId: args.id })
    }

    return userBan
  }
}
