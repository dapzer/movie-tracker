import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateMediaListDto } from '@/routes/mediaList/dto/updateMediaList.dto';
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaListType } from '@movie-tracker/types';

@Injectable()
export class MediaListService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
  ) {}

  private async isListOwner(
    id: string,
    userId: string,
    mediaListBase?: MediaListType,
  ) {
    const mediaList =
      mediaListBase ?? (await this.mediaListRepository.getMedialListById(id));

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return mediaList.userId === userId;
  }

  async getAllMedialLists(isPublicOnly = false) {
    return this.mediaListRepository.getAllMedialLists(isPublicOnly);
  }

  async getMedialListById(id: string, userId: string) {
    const mediaList = await this.mediaListRepository.getMedialListById(id);
    const isListOwner = await this.isListOwner(id, userId, mediaList);

    if (!isListOwner && !mediaList.isPublic) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    return mediaList;
  }

  async getMedialListByUserId(userId: string, currentUserId: string) {
    const isPublicOnly = userId !== currentUserId;

    if (!userId) {
      throw new HttpException('User ID is required.', HttpStatus.BAD_REQUEST);
    }

    return this.mediaListRepository.getMedialListsByUserId(
      userId,
      isPublicOnly,
    );
  }

  async createMediaList(userId: string) {
    return this.mediaListRepository.createMediaList(userId);
  }

  async updateMediaList(id: string, body: UpdateMediaListDto, userId: string) {
    const isListOwner = await this.isListOwner(id, userId);

    if (!isListOwner) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    return this.mediaListRepository.updateMediaList(id, body);
  }

  async deleteMediaList(id: string, userId: string) {
    const mediaList = await this.mediaListRepository.getMedialListById(id);
    const isListOwner = await this.isListOwner(id, userId, mediaList);

    if (!isListOwner) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    if (mediaList.isSystem) {
      throw new HttpException(
        'System media list cannot be deleted.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.mediaListRepository.deleteMediaList(id);
  }
}
