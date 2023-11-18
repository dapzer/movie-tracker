import { UserRepositoryInterface } from '@/repositories/user/UserRepositoryInterface';
import { PrismaService } from '@/services/prisma/prisma.service';
import { UserDto } from '@/routes/auth/dto/user.dto';
export declare class PrismaUserRepository implements UserRepositoryInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        roles: import("@prisma/client").$Enums.UserRoleEnum[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(body: Pick<UserDto, 'email' | 'name' | 'image'>): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        roles: import("@prisma/client").$Enums.UserRoleEnum[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, body: Partial<Pick<UserDto, 'name' | 'image'>>): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        roles: import("@prisma/client").$Enums.UserRoleEnum[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        roles: import("@prisma/client").$Enums.UserRoleEnum[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
