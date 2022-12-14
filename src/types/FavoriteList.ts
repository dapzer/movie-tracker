export declare module FavoriteList {
  export interface SeriesData {
    currentEpisode: number;
    currentSeason: number;
    sitesToView?: SitesToViewObject[];
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
    addedDate?: string | number;
    mediaType?: string;
    seriesData: SeriesData;
    currentStatus: StatusesNames;
  }
}
