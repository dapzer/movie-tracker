import { accounts } from "@movie-tracker/database"
import { Injectable } from "@nestjs/common"
import { and, eq } from "drizzle-orm"
import { AccountRepositoryInterface, AccountType } from "@/repositories/account/AccountRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

@Injectable()
export class DrizzleAccountRepository implements AccountRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(account?: typeof accounts.$inferSelect | null): AccountType | null {
    if (!account) {
      return null
    }

    return {
      id: account.id,
      userId: account.userId,
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      expires_at: account.expiresAt,
      type: account.type,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }
  }

  async getById(id: string) {
    const [account] = await this.drizzle.client
      .select()
      .from(accounts)
      .where(eq(accounts.id, id))
      .limit(1)

    return this.convertToInterface(account)
  }

  async getByProvider(args: Parameters<AccountRepositoryInterface["getByProvider"]>[0]) {
    const [account] = await this.drizzle.client
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, args.provider),
          eq(accounts.providerAccountId, args.providerAccountId),
        ),
      )
      .limit(1)

    return this.convertToInterface(account)
  }

  async create(args: Parameters<AccountRepositoryInterface["create"]>[0]) {
    const [account] = await this.drizzle.client
      .insert(accounts)
      .values({
        provider: args.provider,
        providerAccountId: args.providerAccountId,
        accessToken: args.access_token,
        refreshToken: args.refresh_token,
        expiresAt: args.expires_at,
        userId: args.userId,
        type: args.type,
      })
      .returning()

    return this.convertToInterface(account)
  }

  async updateById(args: Parameters<AccountRepositoryInterface["updateById"]>[0]) {
    const [account] = await this.drizzle.client
      .update(accounts)
      .set({
        provider: args.body.provider,
        providerAccountId: args.body.providerAccountId,
        accessToken: args.body.access_token,
        refreshToken: args.body.refresh_token,
        expiresAt: args.body.expires_at,
      })
      .where(eq(accounts.id, args.id))
      .returning()

    return this.convertToInterface(account)
  }

  async deleteAccount(id: string) {
    const [account] = await this.drizzle.client
      .delete(accounts)
      .where(eq(accounts.id, id))
      .returning()

    return this.convertToInterface(account)
  }
}
