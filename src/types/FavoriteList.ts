export declare module FavoriteList {
  export interface SeriesData {
    currentEpisode: number;
    currentSeason: number;
    siteToView?: string;
  }

  export interface RootObject {
    id: number;
    addedDate?: string;
    mediaType?: string;
    seriesData: SeriesData;
  }
}
