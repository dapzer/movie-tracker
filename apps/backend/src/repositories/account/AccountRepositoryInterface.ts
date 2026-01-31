export const AccountRepositorySymbol = Symbol("AccountRepositorySymbol")

export interface AccountType {
  id: string
  userId: string
  access_token: string
  refresh_token: string
  provider: string
  providerAccountId: string
  expires_at: number
  type: string
  createdAt: Date
  updatedAt: Date
}

export interface AccountRepositoryInterface {
  getById: (id: string) => Promise<AccountType>

  getByProvider: (
    args: {
      provider: string
      providerAccountId: string
    }
  ) => Promise<AccountType>

  create: (
    args: Omit<AccountType, "id" | "createdAt" | "updatedAt">
  ) => Promise<AccountType>

  updateById: (
    args: {
      id: string
      body: Omit<AccountType, "id" | "createdAt" | "updatedAt">
    }
  ) => Promise<AccountType>

  deleteAccount: (id: string) => Promise<AccountType>
}
