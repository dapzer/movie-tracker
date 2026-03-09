import { mediaDetails, mediaItems, mediaListLikes, mediaLists } from "@movie-tracker/database"
import { and, desc, eq, inArray } from "@movie-tracker/database/drizzle"
import { MediaListAccessLevelEnum, MediaListLikeType, MediaListPosterType, MediaListType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { init } from "@paralleldrive/cuid2"
import { count } from "drizzle-orm"
import { MediaListRepositoryInterface } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type MediaListRow = typeof mediaLists.$inferSelect

interface MediaListExtras {
  likesCount: number
  mediaItemsCount: number
  isLiked: boolean
  poster: MediaListPosterType
}

@Injectable()
export class DrizzleMediaListRepository implements MediaListRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertLikeToInterface(data: typeof mediaListLikes.$inferSelect): MediaListLikeType {
    return {
      id: data.id,
      mediaListId: data.mediaListId,
      userId: data.userId,
      createdAt: data.createdAt,
    }
  }

  private convertToInterface(
    data: MediaListRow | null,
    extras?: Partial<MediaListExtras>,
  ): MediaListType | null {
    if (!data) {
      return null
    }

    return {
      id: data.id,
      humanFriendlyId: data.humanFriendlyId,
      userId: data.userId,
      isSystem: data.isSystem,
      accessLevel: MediaListAccessLevelEnum[data.accessLevel],
      title: data.title,
      description: data.description,
      likesCount: extras?.likesCount,
      mediaItemsCount: extras?.mediaItemsCount,
      isLiked: Boolean(extras?.isLiked),
      poster: extras?.poster,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private async getMediaItemsCountByListIds(listIds: string[]) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaItems.mediaListId, count: count() })
      .from(mediaItems)
      .where(inArray(mediaItems.mediaListId, listIds))
      .groupBy(mediaItems.mediaListId)

    return new Map(rows.map(row => [row.mediaListId, Number(row.count)]))
  }

  private async getLikesCountByListIds(listIds: string[]) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaListLikes.mediaListId, count: count() })
      .from(mediaListLikes)
      .where(inArray(mediaListLikes.mediaListId, listIds))
      .groupBy(mediaListLikes.mediaListId)

    return new Map(rows.map(row => [row.mediaListId, Number(row.count)]))
  }

  private async getLikedListIds(listIds: string[], userId: string) {
    const rows = await this.drizzle.client
      .select({ mediaListId: mediaListLikes.mediaListId })
      .from(mediaListLikes)
      .where(
        and(
          inArray(mediaListLikes.mediaListId, listIds),
          eq(mediaListLikes.userId, userId),
        ),
      )

    return new Set(rows.map(row => row.mediaListId))
  }

  private async getPostersByListIds(listIds: string[]) {
    const postersByListId = new Map<string, MediaListPosterType>()

    await Promise.all(listIds.map(async (listId) => {
      const rows = await this.drizzle.client
        .select({ mediaDetails })
        .from(mediaItems)
        .leftJoin(mediaDetails, eq(mediaItems.mediaDetailsId, mediaDetails.id))
        .where(eq(mediaItems.mediaListId, listId))
        .orderBy(desc(mediaItems.createdAt))
        .limit(6)

      const poster = rows.reduce<MediaListPosterType>((acc, row) => {
        acc.ru.push(row.mediaDetails?.ru?.poster)
        acc.en.push(row.mediaDetails?.en?.poster)
        return acc
      }, { en: [], ru: [] })

      postersByListId.set(listId, poster)
    }))

    return postersByListId
  }

  private async hydrateMediaLists(args: { rows?: MediaListRow[], currentUserId?: string }) {
    if (!args.rows?.length) {
      return []
    }

    const listIds = args.rows.map(row => row.id)
    const [
      mediaItemsCountByListId,
      likesCountByListId,
      likedListIds,
      postersByListId,
    ] = await Promise.all([
      this.getMediaItemsCountByListIds(listIds),
      this.getLikesCountByListIds(listIds),
      args.currentUserId
        ? this.getLikedListIds(listIds, args.currentUserId)
        : Promise.resolve(new Set<string>()),
      this.getPostersByListIds(listIds),
    ])

    return args.rows.map(row => this.convertToInterface(row, {
      mediaItemsCount: mediaItemsCountByListId.get(row.id) ?? 0,
      likesCount: likesCountByListId.get(row.id) ?? 0,
      isLiked: likedListIds.has(row.id),
      poster: postersByListId.get(row.id) ?? { en: [], ru: [] },
    }))
  }

  async getById(args: Parameters<MediaListRepositoryInterface["getById"]>[0]) {
    const [mediaList] = await this.drizzle.client
      .select()
      .from(mediaLists)
      .where(eq(mediaLists.id, args.id))
      .limit(1)

    const [result] = await this.hydrateMediaLists({
      rows: mediaList ? [mediaList] : [],
      currentUserId: args.currentUserId,
    })

    return result ?? null
  }

  async getByIds(args: Parameters<MediaListRepositoryInterface["getByIds"]>[0]) {
    if (!args.ids.length) {
      return []
    }

    const rows = await this.drizzle.client
      .select()
      .from(mediaLists)
      .where(inArray(mediaLists.id, args.ids))

    return rows.map(row => this.convertToInterface(row))
  }

  async getByMediaItemAndUserId(
    args: Parameters<MediaListRepositoryInterface["getByMediaItemAndUserId"]>[0],
  ) {
    const [row] = await this.drizzle.client
      .select({ mediaList: mediaLists })
      .from(mediaLists)
      .innerJoin(mediaItems, eq(mediaItems.mediaListId, mediaLists.id))
      .where(
        and(
          eq(mediaLists.userId, args.userId),
          eq(mediaItems.id, args.mediaItemId),
        ),
      )
      .limit(1)

    return this.convertToInterface(row.mediaList)
  }

  async getByHumanFriendlyId(
    args: Parameters<MediaListRepositoryInterface["getByHumanFriendlyId"]>[0],
  ) {
    const [mediaList] = await this.drizzle.client
      .select()
      .from(mediaLists)
      .where(eq(mediaLists.humanFriendlyId, args.id))
      .limit(1)

    const [result] = await this.hydrateMediaLists({
      rows: mediaList ? [mediaList] : [],
      currentUserId: args.currentUserId,
    })

    return result ?? null
  }

  async getByUserId(
    args: Parameters<MediaListRepositoryInterface["getByUserId"]>[0],
  ) {
    const conditions = [eq(mediaLists.userId, args.userId)]
    if (args.isPublicOnly) {
      conditions.push(eq(mediaLists.accessLevel, MediaListAccessLevelEnum.PUBLIC))
    }

    const rows = await this.drizzle.client
      .select()
      .from(mediaLists)
      .where(and(...conditions))

    return this.hydrateMediaLists({
      rows,
      currentUserId: args.currentUserId,
    })
  }

  async create(args: Parameters<MediaListRepositoryInterface["create"]>[0]) {
    const generateCuid = init({ length: 10 })
    const [mediaList] = await this.drizzle.client
      .insert(mediaLists)
      .values({
        userId: args.userId,
        humanFriendlyId: generateCuid(),
        isSystem: args.isSystem ?? false,
        title: args.body?.title,
        description: args.body?.description,
        accessLevel: args.body?.accessLevel,
      })
      .returning()

    const [result] = await this.hydrateMediaLists({
      rows: mediaList ? [mediaList] : [],
    })

    return result ?? null
  }

  async delete(id: string) {
    const [mediaList] = await this.drizzle.client
      .delete(mediaLists)
      .where(eq(mediaLists.id, id))
      .returning()

    return this.convertToInterface(mediaList)
  }

  async update(args: Parameters<MediaListRepositoryInterface["update"]>[0]) {
    const [mediaList] = await this.drizzle.client
      .update(mediaLists)
      .set({
        title: args.body.title,
        description: args.body.description,
        accessLevel: args.body.accessLevel,
      })
      .where(eq(mediaLists.id, args.id))
      .returning()

    const [result] = await this.hydrateMediaLists({
      rows: mediaList ? [mediaList] : [],
    })

    return result ?? null
  }

  async getCount() {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaLists)

    return result?.count ?? 0
  }

  async getCountByUserId(userId: string) {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaLists)
      .where(eq(mediaLists.userId, userId))

    return result?.count ?? 0
  }

  async createLike(
    args: Parameters<MediaListRepositoryInterface["createLike"]>[0],
  ) {
    const [mediaListLike] = await this.drizzle.client
      .insert(mediaListLikes)
      .values({
        mediaListId: args.mediaListId,
        userId: args.userId,
      })
      .returning()

    return this.convertLikeToInterface(mediaListLike)
  }

  async deleteLike(
    args: Parameters<MediaListRepositoryInterface["deleteLike"]>[0],
  ) {
    const [mediaListLike] = await this.drizzle.client
      .delete(mediaListLikes)
      .where(
        and(
          eq(mediaListLikes.mediaListId, args.mediaListId),
          eq(mediaListLikes.userId, args.userId),
        ),
      )
      .returning()

    return this.convertLikeToInterface(mediaListLike)
  }
}
