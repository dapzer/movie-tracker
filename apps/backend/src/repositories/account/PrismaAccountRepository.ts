import { Injectable } from "@nestjs/common"
import { AccountRepositoryInterface } from "@/repositories/account/AccountRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaAccountRepository implements AccountRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.account.findUnique({ where: { id } })
  }

  async getByProvider(args: Parameters<AccountRepositoryInterface["getByProvider"]>[0]) {
    return this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: args.provider,
          providerAccountId: args.providerAccountId,
        },
      },
    })
  }

  async create(args: Parameters<AccountRepositoryInterface["create"]>[0]) {
    return this.prisma.account.create({
      data: {
        provider: args.provider,
        providerAccountId: args.providerAccountId,
        access_token: args.access_token,
        refresh_token: args.refresh_token,
        expires_at: args.expires_at,
        userId: args.userId,
        type: args.type,
      },
    })
  }

  async updateById(args: Parameters<AccountRepositoryInterface["updateById"]>[0]) {
    return this.prisma.account.update({
      where: { id: args.id },
      data: {
        provider: args.body.provider,
        providerAccountId: args.body.providerAccountId,
        access_token: args.body.access_token,
        refresh_token: args.body.refresh_token,
        expires_at: args.body.expires_at,
      },
    })
  }

  async deleteAccount(id: string) {
    return this.prisma.account.delete({ where: { id } })
  }
}
