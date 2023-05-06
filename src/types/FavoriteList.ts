import { FavioriteItem, StatusesNames as StatusesNamesBase } from '@prisma/client';

export module FavoriteList {
  export interface TrackingData {
    currentStatus: StatusesNames;
    note: string
    sitesToView: SitesToViewObject[];
    seriesInfo: SeriesInfo;
  }

  export interface SeriesInfo {
    currentSeason: number;
    currentEpisode: number;
  }

  export interface SitesToViewObject {
    url: string;
  }

  export interface StatusedObject {
    notViewed: RootObject[];
    watchingNow: RootObject[];
    viewed: RootObject[];
    waitNewPart: RootObject[];
    allFavorites: RootObject[];
  }

  export type StatusesNames = StatusesNamesBase;

  export type RootObject = FavioriteItem
}
