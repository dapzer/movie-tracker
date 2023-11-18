import { UserService } from '@/routes/user/user.service';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { MongoDbIdDto } from '@/shared/dto/mongoDbId.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(user: UserDto): Promise<UserDto>;
    getUserById(params: MongoDbIdDto): Promise<UserDto>;
    deleteUser(params: MongoDbIdDto, user: UserDto): Promise<UserDto>;
}
