import { User, UserRoleEnum } from '@prisma/client';
export declare class UserDto implements User {
    id: string;
    name: string;
    email: string;
    image: string;
    roles: UserRoleEnum[];
    createdAt: Date;
    updatedAt: Date;
}
