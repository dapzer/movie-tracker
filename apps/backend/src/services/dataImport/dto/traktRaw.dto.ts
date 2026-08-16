import { z } from "zod"

const traktTimestampSchema = z.iso.datetime({ offset: true }).pipe(z.coerce.date())
const traktPositiveIntegerSchema = z.number().int().positive()

const traktPlexIdsSchema = z.looseObject({
  guid: z.string().min(1),
  slug: z.string().min(1).optional(),
})

const traktIdsBaseSchema = z.looseObject({
  trakt: traktPositiveIntegerSchema,
  slug: z.string().min(1).optional(),
  imdb: z.string().min(1).optional(),
  tmdb: traktPositiveIntegerSchema.optional(),
  tvdb: traktPositiveIntegerSchema.optional(),
  tvrage: traktPositiveIntegerSchema.nullable().optional(),
})

export const traktIdsSchema = traktIdsBaseSchema.extend({
  plex: traktPlexIdsSchema.optional(),
})

const traktMediaBaseSchema = z.looseObject({
  ids: traktIdsSchema,
  title: z.string().min(1),
  year: z.number().int().positive().optional(),
})

export const traktMovieSchema = traktMediaBaseSchema

export const traktShowSchema = traktMediaBaseSchema.extend({
  aired_episodes: z.number().int().nonnegative().optional(),
})

export const traktEpisodeSchema = traktMediaBaseSchema.extend({
  number: z.number().int().positive(),
  season: z.number().int().nonnegative(),
})

const traktCommentSchema = z.looseObject({
  id: traktPositiveIntegerSchema,
  comment: z.string(),
  spoiler: z.boolean(),
  review: z.boolean(),
  parent_id: z.number().int().nonnegative(),
  created_at: traktTimestampSchema,
  updated_at: traktTimestampSchema,
  replies: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  user_rating: z.number().min(0).max(10).nullable().optional(),
  language: z.string().min(1).nullable().optional(),
  user_stats: z.looseObject({
    rating: z.number().min(0).max(10).nullable(),
    play_count: z.number().int().nonnegative(),
    completed_count: z.number().int().nonnegative(),
  }).optional(),
  user: z.looseObject({
    username: z.string().min(1),
    private: z.boolean(),
    deleted: z.boolean(),
    name: z.string().nullable(),
    vip: z.boolean(),
    vip_ep: z.boolean(),
    director: z.boolean(),
    ids: z.looseObject({
      slug: z.string().min(1),
      trakt: traktPositiveIntegerSchema,
    }),
  }).optional(),
})

const traktRatingItemBaseSchema = z.looseObject({
  rated_at: traktTimestampSchema,
  rating: z.number().min(1).max(10),
})

export const traktRatingMovieItemSchema = traktRatingItemBaseSchema.extend({
  type: z.literal("movie"),
  movie: traktMovieSchema,
})

export const traktRatingShowItemSchema = traktRatingItemBaseSchema.extend({
  type: z.literal("show"),
  show: traktShowSchema,
})

const traktCommentItemBaseSchema = z.looseObject({
  comment: traktCommentSchema,
})

export const traktCommentMovieItemSchema = traktCommentItemBaseSchema.extend({
  type: z.literal("movie"),
  movie: traktMovieSchema,
})

export const traktCommentShowItemSchema = traktCommentItemBaseSchema.extend({
  type: z.literal("show"),
  show: traktShowSchema,
})

const traktNoteTargetBaseSchema = z.looseObject({})

export const traktNoteMovieTargetSchema = traktNoteTargetBaseSchema.extend({
  type: z.literal("movie"),
  movie: traktMovieSchema,
})

export const traktNoteShowTargetSchema = traktNoteTargetBaseSchema.extend({
  type: z.literal("show"),
  show: traktShowSchema,
})

export const traktNoteTargetSchema = z.discriminatedUnion("type", [
  traktNoteMovieTargetSchema,
  traktNoteShowTargetSchema,
])

const traktNoteBaseSchema = z.looseObject({
  id: traktPositiveIntegerSchema,
  notes: z.string().nullable().optional(),
  privacy: z.string().min(1).optional(),
  spoiler: z.boolean().optional(),
  created_at: traktTimestampSchema.optional(),
  updated_at: traktTimestampSchema.optional(),
})

export const traktNoteItemSchema = traktNoteBaseSchema.extend({
  item: traktNoteTargetSchema,
})

const traktWatchedItemBaseSchema = z.looseObject({
  last_updated_at: traktTimestampSchema,
  last_watched_at: traktTimestampSchema,
  plays: z.number().int().positive(),
})

export const traktWatchedMovieItemSchema = traktWatchedItemBaseSchema.extend({
  movie: traktMovieSchema,
  total_count: z.number().int().nonnegative(),
})

export const traktWatchedShowItemSchema = traktWatchedItemBaseSchema.extend({
  reset_at: traktTimestampSchema.nullable(),
  show: traktShowSchema,
})

const traktWatchedHistoryBaseSchema = z.looseObject({
  id: traktPositiveIntegerSchema,
  watched_at: traktTimestampSchema,
  action: z.literal("watch"),
})

export const traktWatchedHistoryEpisodeItemSchema = traktWatchedHistoryBaseSchema.extend({
  type: z.literal("episode"),
  episode: traktEpisodeSchema,
  show: traktShowSchema,
})

export const traktWatchedHistoryTypeSchema = z.looseObject({
  type: z.enum(["movie", "episode"]),
})

const traktListItemBaseSchema = z.looseObject({
  rank: z.number().int().nonnegative(),
  id: traktPositiveIntegerSchema,
  listed_at: traktTimestampSchema,
  notes: z.string().nullable(),
  my_rating: z.number().min(0).max(10).nullable(),
})

const traktListMovieItemSchema = traktListItemBaseSchema.extend({
  type: z.literal("movie"),
  movie: traktMovieSchema,
})

const traktListShowItemSchema = traktListItemBaseSchema.extend({
  type: z.literal("show"),
  show: traktShowSchema,
})

export const traktWatchlistItemSchema = z.union([traktListMovieItemSchema, traktListShowItemSchema])
export const traktFavoritesItemSchema = z.union([traktListMovieItemSchema, traktListShowItemSchema])
export const traktCustomListItemSchema = z.union([traktListMovieItemSchema, traktListShowItemSchema])

export const traktCustomListMetadataSchema = z.looseObject({
  name: z.string().min(1),
  description: z.string(),
  privacy: z.enum(["public", "private", "friends"]),
  share_link: z.url(),
  type: z.string().min(1),
  display_numbers: z.boolean(),
  allow_comments: z.boolean(),
  sort_by: z.string().min(1),
  sort_how: z.string().min(1),
  created_at: traktTimestampSchema,
  updated_at: traktTimestampSchema,
  item_count: z.number().int().nonnegative(),
  comment_count: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  ids: z.looseObject({
    slug: z.string().min(1),
    trakt: traktPositiveIntegerSchema,
  }),
  images: z.looseObject({
    posters: z.array(z.string()),
  }),
  user: z.looseObject({
    ids: z.looseObject({
      slug: z.string().min(1),
      trakt: traktPositiveIntegerSchema,
    }),
    images: z.looseObject({
      avatar: z.looseObject({
        full: z.url(),
      }),
    }),
    username: z.string().min(1),
    private: z.boolean(),
    deleted: z.boolean(),
    joined_at: traktTimestampSchema,
    location: z.string(),
    about: z.string().nullable(),
    name: z.string().nullable(),
    gender: z.string(),
    age: z.number().int().nonnegative().nullable(),
    vip: z.boolean(),
    vip_ep: z.boolean(),
    vip_cover_image: z.string().nullable(),
    director: z.boolean(),
  }),
  total_count: z.number().int().nonnegative(),
})
