import {
  MediaListViewRepositoryInterface,
  MediaListViewRepositorySymbol,
} from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class MediaListViewService {
  constructor(
    @Inject(MediaListViewRepositorySymbol) private readonly mediaListViewRepository: MediaListViewRepositoryInterface,
  ) {}

  async sendMediaListView(args: { mediaListId: string, userId: string }): Promise<void> {
    const mediaListView = await this.mediaListViewRepository.getMediaListView(args)

    if (mediaListView) {
      return this.mediaListViewRepository.updateMediaListView({
        id: mediaListView.id,
      })
    }
    return this.mediaListViewRepository.createMediaListView(args)
  }
}
