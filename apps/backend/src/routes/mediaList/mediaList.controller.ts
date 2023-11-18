import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaListService } from '@/routes/mediaList/mediaList.service';
import { MongoDbIdDto } from '@/shared/dto/mongoDbId.dto';
import { UpdateMediaListDto } from '@/routes/mediaList/dto/updateMediaList.dto';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { User } from '@/routes/user/users.decorator';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { GetAllMediaListsDto } from '@/routes/mediaList/dto/getAllMediaLists.dto';

@Controller('mediaList')
export class MediaListController {
  constructor(private readonly mediaListService: MediaListService) {}

  @Get()
  async getMedialListByUserId(
    @Query() queries: GetAllMediaListsDto,
    @User() user: UserDto,
  ) {
    if (queries.userId) {
      return this.mediaListService.getMedialListByUserId(
        queries.userId,
        user?.id,
      );
    }

    return this.mediaListService.getMedialListByUserId(user?.id, user?.id);
  }

  @Get(':id')
  async getMedialListById(
    @Param() params: MongoDbIdDto,
    @User() user: UserDto,
  ) {
    return this.mediaListService.getMedialListById(params.id, user?.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createMediaList(@User() user: UserDto) {
    return this.mediaListService.createMediaList(user?.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateMediaList(
    @Param() params: MongoDbIdDto,
    @Body() body: UpdateMediaListDto,
    @User() user: UserDto,
  ) {
    return this.mediaListService.updateMediaList(params.id, body, user?.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteMediaList(@Param() params: MongoDbIdDto, @User() user: UserDto) {
    return this.mediaListService.deleteMediaList(params.id, user?.id);
  }
}
