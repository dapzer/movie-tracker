import { MediaListService } from '@/routes/mediaList/mediaList.service';
import { MongoDbIdDto } from '@/shared/dto/mongoDbId.dto';
import { UpdateMediaListDto } from '@/routes/mediaList/dto/updateMediaList.dto';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { GetAllMediaListsDto } from '@/routes/mediaList/dto/getAllMediaLists.dto';
export declare class MediaListController {
    private readonly mediaListService;
    constructor(mediaListService: MediaListService);
    getMedialListByUserId(queries: GetAllMediaListsDto, user: UserDto): Promise<import("./dto/mediaList.dto").MediaListDto[]>;
    getMedialListById(params: MongoDbIdDto, user: UserDto): Promise<import("./dto/mediaList.dto").MediaListDto>;
    createMediaList(user: UserDto): Promise<import("./dto/mediaList.dto").MediaListDto>;
    updateMediaList(params: MongoDbIdDto, body: UpdateMediaListDto, user: UserDto): Promise<import("./dto/mediaList.dto").MediaListDto>;
    deleteMediaList(params: MongoDbIdDto, user: UserDto): Promise<import("./dto/mediaList.dto").MediaListDto>;
}
