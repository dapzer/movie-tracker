export declare module FavoriteList {
  export interface SeriesData {
    currentEpisode: number;
    currentSeason: number;
    siteToView?: string | null;
  }

  export interface RootObject {
    id: number;
    addedDate?: string | number;
    mediaType?: string;
    seriesData: SeriesData;
  }
}
