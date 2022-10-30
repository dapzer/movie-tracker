export declare module FavoriteList {
  export interface SeriesData {
    currentEpisode: number;
    currentSeason: number;
    siteToView?: string | null;
  }

  export interface StatusedObject {
    notViewed: RootObject[];
    watchingNow: RootObject[];
    viewed: RootObject[];
    waitNewPart: RootObject[];
    allFavorites: RootObject[];
  }

  export interface RootObject {
    id: number;
    addedDate?: string | number;
    mediaType?: string;
    seriesData: SeriesData;
    currentStatus: string;
  }
}
