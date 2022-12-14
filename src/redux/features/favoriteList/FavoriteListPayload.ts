import { FavoriteList } from '../../../types/FavoriteList';

export declare namespace FavoriteListPayload {
  export interface Delete {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
  }

  export interface AddNew {
    userId: string;
    favoriteItem: FavoriteList.RootObject;
  }

  export interface UpdateSeriesData {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
    newSeriesData: FavoriteList.SeriesData;
  }

  export interface ChangeStatus {
    mediaId: number;
    mediaStatus: FavoriteList.StatusesNames;
    newStatus: FavoriteList.StatusesNames;
  }
}
