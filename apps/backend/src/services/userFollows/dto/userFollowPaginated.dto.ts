import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { UserFollowDto } from "./userFollow.dto"

export class UserFollowPaginatedDto extends PaginatedDto(UserFollowDto) {}
