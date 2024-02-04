import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma/prisma.service';
import {
  AccountRepositoryInterface,
  AccountType,
} from '@/repositories/account/AccountRepositoryInterface';

@Injectable()
export class PrismaAccountRepository implements AccountRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getAccountById(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async getAccountByProvider(provider: string, providerAccountId: string) {
    return this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
  }

  async createAccount(
    body: Omit<AccountType, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.prisma.account.create({
      data: {
        provider: body.provider,
        providerAccountId: body.providerAccountId,
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        expires_at: body.expires_at,
        userId: body.userId,
        type: body.type,
      },
    });
  }

  async updateAccount(
    id: string,
    body: Omit<AccountType, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.prisma.account.update({
      where: { id },
      data: {
        provider: body.provider,
        providerAccountId: body.providerAccountId,
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        expires_at: body.expires_at,
      },
    });
  }

  async deleteAccount(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
