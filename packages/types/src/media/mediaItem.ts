export enum MediaTypeEnum {
  MOVIE = "MOVIE",
  TV = "TV",
}

export enum StatusNameEnum {
  VIEWED = "VIEWED",
  WATCHING_NOW = "WATCHING_NOW",
  NOT_VIEWED = "NOT_VIEWED",
  WAIT_NEW_PART = "WAIT_NEW_PART",
}

export interface MediaItem {
  id: string;
  mediaId: number;
  mediaDetailsId: string;
  mediaListId: string;
  mediaType: MediaTypeEnum;
  trackingData: MediaItemTrackingDataType;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItemTrackingDataType {
  currentStatus: StatusNameEnum;
  note: string;
  score: number | null;
  seriesInfo: MediaItemSeriesInfoType;
  sitesToView: Array<MediaItemSiteToViewType>;
}

export interface MediaItemSeriesInfoType {
  currentSeason: number;
  currentEpisode: number;
}

export interface MediaItemSiteToViewType {
  url: string;
}
