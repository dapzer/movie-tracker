import { Inject, Injectable } from "@nestjs/common"
import {
  MediaListViewRepositoryInterface,
  MediaListViewRepositorySymbol,
} from "@/repositories/mediaListView/MediaListViewRepositoryInterface"

@Injectable()
export class MediaListViewService {
  constructor(
    @Inject(MediaListViewRepositorySymbol) private readonly mediaListViewRepository: MediaListViewRepositoryInterface,
  ) {}

  async sendMediaListView(args: { mediaListId: string, userId: string }): Promise<void> {
    const mediaListView = await this.mediaListViewRepository.getByUseerAndMediaListId(args)

    if (mediaListView) {
      return this.mediaListViewRepository.update({
        id: mediaListView.id,
      })
    }
    return this.mediaListViewRepository.create(args)
  }
}
