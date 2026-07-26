import { NotificationTypeEnum } from "@movie-tracker/types"
import { Inject, Injectable, Logger } from "@nestjs/common"
import { UserBanRepositoryInterface, UserBanRepositorySymbol } from "@/repositories/userBan/UserBanRepositoryInterface"
import { NotificationsService } from "@/services/notifications/notifications.service"
import { CreateUserBanDto } from "@/services/userBans/dto/createUserBan.dto"
import { GetUserBansQueryDto } from "@/services/userBans/dto/getUserBansQuery.dto"
import { UserBanAlreadyRevokedError, UserBanNotFoundError } from "@/shared/errors/userBan"

@Injectable()
export class UserBansService {
  private readonly logger = new Logger("UserBansService")

  constructor(
    @Inject(UserBanRepositorySymbol)
    private readonly userBanRepository: UserBanRepositoryInterface,
    private readonly notificationsService: NotificationsService,
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
    const userBan = await this.userBanRepository.create({
      ...args.body,
      issuedBy: args.currentUserId,
    })

    await this.notificationsService.create({
      userId: userBan.userId,
      type: NotificationTypeEnum.USER_BAN_CREATED,
      meta: {
        userBanId: userBan.id,
        reason: userBan.reason,
        expiresAt: userBan.expiresAt,
      },
      createdAt: userBan.createdAt,
    }).catch((err) => {
      this.logger.error(err, "Failed to create user ban notification")
    })

    return userBan
  }

  async revoke(args: { id: string, currentUserId: string }) {
    const userBan = await this.userBanRepository.getById({ id: args.id })

    if (!userBan) {
      throw new UserBanNotFoundError({ userBanId: args.id })
    }

    if (userBan.revokedAt) {
      throw new UserBanAlreadyRevokedError({ userBanId: args.id })
    }

    const revokedUserBan = await this.userBanRepository.revoke({
      id: args.id,
      revokedBy: args.currentUserId,
    })

    if (revokedUserBan) {
      await this.notificationsService.create({
        userId: revokedUserBan.userId,
        type: NotificationTypeEnum.USER_BAN_REVOKED,
        meta: {
          userBanId: revokedUserBan.id,
        },
        createdAt: revokedUserBan.revokedAt,
      }).catch((err) => {
        this.logger.error(err, "Failed to create user ban revoked notification")
      })
    }

    return revokedUserBan
  }
}
