export declare module LocalStorageMovie {
  export interface SeriesInfo {
    currentEpisode: number;
    currentSeason: number;
    siteToView?: string;
  }

  export interface RootObject {
    id: number;
    showType: string;
    addedDate: string;
    seriesInfo: SeriesInfo;
  }
}
