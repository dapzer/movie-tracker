import { AccountRepositoryInterface } from '@/repositories/Account/AccountRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import { AccountDto } from '@/routes/auth/dto/account.dto';
export declare class PrismaAccountRepository implements AccountRepositoryInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAccountById(id: string): Promise<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string;
        access_token: string;
        expires_at: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAccountByProvider(provider: string, providerAccountId: string): Promise<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string;
        access_token: string;
        expires_at: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createAccount(body: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string;
        access_token: string;
        expires_at: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAccount(id: string, body: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string;
        access_token: string;
        expires_at: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAccount(id: string): Promise<{
        id: string;
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string;
        access_token: string;
        expires_at: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
