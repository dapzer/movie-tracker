export const AccountRepositorySymbol = Symbol()

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
  getAccountById: (id: string) => Promise<AccountType>

  getAccountByProvider: (
    provider: string,
    providerAccountId: string,
  ) => Promise<AccountType>

  createAccount: (
    body: Omit<AccountType, "id" | "createdAt" | "updatedAt">,
  ) => Promise<AccountType>

  updateAccount: (
    id: string,
    body: Omit<AccountType, "id" | "createdAt" | "updatedAt">,
  ) => Promise<AccountType>

  deleteAccount: (id: string) => Promise<AccountType>
}
