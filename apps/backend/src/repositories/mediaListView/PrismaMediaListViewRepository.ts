import { MediaListViewRepositoryInterface } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaMediaListViewRepository implements MediaListViewRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
  }

  async createMediaListView(args: Parameters<MediaListViewRepositoryInterface["createMediaListView"]>[0]) {
    await this.prisma.mediaListView.create({
      data: {
        mediaListId: args.mediaListId,
        userId: args.userId,
      },
    })
  }

  async updateMediaListView(args: Parameters<MediaListViewRepositoryInterface["updateMediaListView"]>[0]) {
    await this.prisma.mediaListView.update({
      where: {
        id: args.id,
      },
      data: {
        id: args.id,
      },
    })
  }

  async getMediaListView(args: Parameters<MediaListViewRepositoryInterface["getMediaListView"]>[0]): ReturnType<MediaListViewRepositoryInterface["getMediaListView"]> {
    return this.prisma.mediaListView.findUnique({
      where: {
        mediaListId_userId: {
          mediaListId: args.mediaListId,
          userId: args.userId,
        },
      },
    })
  }
}
