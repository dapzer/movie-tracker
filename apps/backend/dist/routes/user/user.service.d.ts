import { UserRepositoryInterface } from '@/repositories/user/UserRepositoryInterface';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepositoryInterface);
    getUser(id: string): Promise<import("../auth/dto/user.dto").UserDto>;
    deleteUser(id: string, currentUserId: string): Promise<import("../auth/dto/user.dto").UserDto>;
}
