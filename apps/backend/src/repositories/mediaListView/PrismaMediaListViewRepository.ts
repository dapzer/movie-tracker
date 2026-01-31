import { Injectable } from "@nestjs/common"
import { MediaListViewRepositoryInterface } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaMediaListViewRepository implements MediaListViewRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(args: Parameters<MediaListViewRepositoryInterface["create"]>[0]) {
    await this.prisma.mediaListView.create({
      data: {
        mediaListId: args.mediaListId,
        userId: args.userId,
      },
    })
  }

  async update(args: Parameters<MediaListViewRepositoryInterface["update"]>[0]) {
    await this.prisma.mediaListView.update({
      where: {
        id: args.id,
      },
      data: {
        id: args.id,
      },
    })
  }

  async getByUseerAndMediaListId(args: Parameters<MediaListViewRepositoryInterface["getByUseerAndMediaListId"]>[0]): ReturnType<MediaListViewRepositoryInterface["getByUseerAndMediaListId"]> {
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
