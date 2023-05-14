import { FavoriteList } from '@/types/FavoriteList';

export module FavoriteListPayload {
  export interface Delete {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
  }

  export interface AddNew {
    userId: string;
    mediaId: number
    mediaType: string
  }

  export interface UpdateItem {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
    newTrackingData: FavoriteList.TrackingData;
  }

  export interface UpdateSeriesInfo {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
    seriesInfo: FavoriteList.SeriesInfo;
  }

  export interface ChangeStatus {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
    newStatus: FavoriteList.StatusesNames;
  }
}
