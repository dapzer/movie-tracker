import { FavoriteList } from '@/types/FavoriteList';

export declare namespace FavoriteListThunks {
  export interface Delete {
    userId: string;
    mediaId: number;
  }

  export interface Update {
    userId: string;
    mediaId: number;
    trackingData: FavoriteList.TrackingData;
  }
}
