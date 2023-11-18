import { MediaItemService } from '@/routes/mediaItem/mediaItem.service';
import { CreateMediaItemDto } from '@/routes/mediaItem/dto/createMediaItem.dto';
import { MediaItemTrackingDataDto } from '@/routes/mediaItem/dto/mediaItemTrackingDataDto.dto';
import { MongoDbIdDto } from '@/shared/dto/mongoDbId.dto';
import { MediaItemListIdDto } from '@/shared/dto/mediaItemListId.dto';
import { UserDto } from '@/routes/auth/dto/user.dto';
export declare class MediaItemController {
    private readonly mediaItemService;
    constructor(mediaItemService: MediaItemService);
    createMediaItem(body: CreateMediaItemDto, user: UserDto): Promise<import("./dto/mediaItem.dto").MediaItemDto>;
    getMediaItemsByListId(query: MediaItemListIdDto, user: UserDto): Promise<import("./dto/mediaItem.dto").MediaItemDto[]>;
    deleteMediaItem(params: MongoDbIdDto, user: UserDto): Promise<import("./dto/mediaItem.dto").MediaItemDto>;
    updateMediaItemTrackingData(param: MongoDbIdDto, body: MediaItemTrackingDataDto, user: UserDto): Promise<import("./dto/mediaItem.dto").MediaItemDto>;
}
