import { Injectable } from '@nestjs/common';
import {
  AccountRepositoryInterface,
  AccountType,
} from '@/repositories/Account/AccountRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';

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
    return this.prisma.account.create({ data: body });
  }

  async updateAccount(
    id: string,
    body: Omit<AccountType, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.prisma.account.update({ where: { id }, data: body });
  }

  async deleteAccount(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
