export declare module FavoriteList {
  export interface TrackingData {
    currentStatus: StatusesNames;
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

  export type StatusesNames = keyof StatusedObject;

  export interface RootObject {
    id: number;
    mediaType: string;
    addedDate?: string | number;
    trackingData: TrackingData;
  }
}
