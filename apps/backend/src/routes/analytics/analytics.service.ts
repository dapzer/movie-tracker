import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { AnalyticsRecords } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(MediaDetailsRepositorySymbol)
    private readonly mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
  ) {}

  async getRecords(): Promise<AnalyticsRecords> {
    const [mediaDetails, mediaItems, users, mediaLists, mediaRatings] = await Promise.all([
      this.mediaDetailsRepository.getMediaDetailsCount(),
      this.mediaItemRepository.getMediaItemsCount(),
      this.userRepository.getUsersCount(),
      this.mediaListRepository.getMediaListsCount(),
      this.mediaRatingRepository.getMediaRatingsCount(),
    ])

    return {
      mediaDetails,
      mediaItems,
      users,
      mediaLists,
      mediaRatings,
    }
  }
}
