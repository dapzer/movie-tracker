import * as PrismaTypes from '@prisma/client';

export module FavoriteList {
  export type TrackingData = PrismaTypes.TrackingData

  export type SeriesInfo = PrismaTypes.SeriesInfo

  export type SitesToViewObject = PrismaTypes.SitesToView

  export type StatusedObject = Record<PrismaTypes.StatusesNames, RootObject[]>

  export type StatusesNames = PrismaTypes.StatusesNames;

  export type RootObject = PrismaTypes.FavioriteItem
}
