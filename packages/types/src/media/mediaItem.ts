import { MediaDetailsType } from "./mediaDetails";

export enum MediaTypeEnum {
  MOVIE = "movie",
  TV = "tv",
}

export enum MediaItemStatusNameEnum {
  WATCHING_NOW = "WATCHING_NOW",
  NOT_VIEWED = "NOT_VIEWED",
  WAIT_NEW_PART = "WAIT_NEW_PART",
  VIEWED = "VIEWED",
}

export interface MediaItemType {
  id: string;
  mediaId: number;
  mediaDetailsId: string;
  mediaListId: string;
  mediaType: MediaTypeEnum;
  mediaDetails?: MediaDetailsType;
  trackingData: MediaItemTrackingDataType;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItemTrackingDataType {
  currentStatus: MediaItemStatusNameEnum;
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
