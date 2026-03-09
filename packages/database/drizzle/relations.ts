import { relations } from "drizzle-orm/relations"
import {
  accounts,
  mediaDetails,
  mediaItems,
  mediaListLikes,
  mediaLists,
  mediaListViews,
  mediaRatings,
  notifications,
  releaseSubscriptions,
  trackingData,
  userFollows,
  users,
} from "./schema"

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  mediaLists: many(mediaLists),
  mediaListLikes: many(mediaListLikes),
  notifications: many(notifications),
  mediaListViews: many(mediaListViews),
  userFollows_followerId: many(userFollows, {
    relationName: "userFollows_followerId_users_id",
  }),
  userFollows_followingId: many(userFollows, {
    relationName: "userFollows_followingId_users_id",
  }),
  mediaRatings: many(mediaRatings),
  releaseSubscriptions: many(releaseSubscriptions),
}))

export const mediaItemsRelations = relations(mediaItems, ({ one, many }) => ({
  mediaList: one(mediaLists, {
    fields: [mediaItems.mediaListId],
    references: [mediaLists.id],
  }),
  mediaDetail: one(mediaDetails, {
    fields: [mediaItems.mediaDetailsId],
    references: [mediaDetails.id],
  }),
  trackingData: many(trackingData),
}))

export const mediaListsRelations = relations(mediaLists, ({ one, many }) => ({
  mediaItems: many(mediaItems),
  user: one(users, {
    fields: [mediaLists.userId],
    references: [users.id],
  }),
  mediaListLikes: many(mediaListLikes),
  mediaListViews: many(mediaListViews),
}))

export const mediaDetailsRelations = relations(mediaDetails, ({ many }) => ({
  mediaItems: many(mediaItems),
  mediaRatings: many(mediaRatings),
  releaseSubscriptions: many(releaseSubscriptions),
}))

export const trackingDataRelations = relations(trackingData, ({ one }) => ({
  mediaItem: one(mediaItems, {
    fields: [trackingData.mediaItemId],
    references: [mediaItems.id],
  }),
}))

export const mediaListLikesRelations = relations(mediaListLikes, ({ one }) => ({
  mediaList: one(mediaLists, {
    fields: [mediaListLikes.mediaListId],
    references: [mediaLists.id],
  }),
  user: one(users, {
    fields: [mediaListLikes.userId],
    references: [users.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const mediaListViewsRelations = relations(mediaListViews, ({ one }) => ({
  mediaList: one(mediaLists, {
    fields: [mediaListViews.mediaListId],
    references: [mediaLists.id],
  }),
  user: one(users, {
    fields: [mediaListViews.userId],
    references: [users.id],
  }),
}))

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  user_followerId: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "userFollows_followerId_users_id",
  }),
  user_followingId: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "userFollows_followingId_users_id",
  }),
}))

export const mediaRatingsRelations = relations(mediaRatings, ({ one }) => ({
  user: one(users, {
    fields: [mediaRatings.userId],
    references: [users.id],
  }),
  mediaDetail: one(mediaDetails, {
    fields: [mediaRatings.mediaDetailsId],
    references: [mediaDetails.id],
  }),
}))

export const releaseSubscriptionsRelations = relations(releaseSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [releaseSubscriptions.userId],
    references: [users.id],
  }),
  mediaDetail: one(mediaDetails, {
    fields: [releaseSubscriptions.mediaDetailsId],
    references: [mediaDetails.id],
  }),
}))
