import { AccountDto } from '@/routes/auth/dto/account.dto';
export declare const AccountRepositorySymbol: unique symbol;
export interface AccountRepositoryInterface {
    getAccountById: (id: string) => Promise<AccountDto>;
    getAccountByProvider: (provider: string, providerAccountId: string) => Promise<AccountDto>;
    createAccount: (body: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AccountDto>;
    updateAccount: (id: string, body: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AccountDto>;
    deleteAccount: (id: string) => Promise<AccountDto>;
}
