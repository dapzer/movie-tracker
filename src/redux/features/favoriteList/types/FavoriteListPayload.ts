import { FavoriteList } from '../../../../types/FavoriteList';

export declare namespace FavoriteListPayload {
  export interface Delete {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
  }

  export interface AddNew {
    userId: string;
    favoriteItem: FavoriteList.RootObject;
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
