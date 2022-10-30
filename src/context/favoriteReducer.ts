import { FavoriteList } from '../types/FavoriteList';
import { StatusesNames } from '../types/StatusesNames';

export interface Actions {
  type?: string;
  payload: {
    seriesData?: FavoriteList.SeriesData;
    mediaId?: number;
    newFavoriteItem?: FavoriteList.RootObject;
    favoriteList?: FavoriteList.StatusedObject;
    newStatus?: string;
    currentStatus?: string;
  };
}

export const favoriteReducer = (state: FavoriteList.StatusedObject, action: Actions) => {
  const currentStatus = (action.payload.currentStatus as keyof FavoriteList.StatusedObject) || StatusesNames.notViewed;
  const newStatus = (action.payload.newStatus as keyof FavoriteList.StatusedObject) || StatusesNames.notViewed;
  const newState = { ...state };
  switch (action.type) {
    case 'REMOVE':
      newState[currentStatus] = newState[currentStatus].filter((el: FavoriteList.RootObject) => el.id !== action.payload.mediaId);
      newState.allFavorites = newState.allFavorites.filter((el: FavoriteList.RootObject) => el.id !== action.payload.mediaId);

      return newState;
    case 'UPDATE':
      if (!action.payload.seriesData) return;

      const statusIndex = newState[currentStatus].findIndex((el: FavoriteList.RootObject) => el.id === action.payload.mediaId);
      const index = newState.allFavorites.findIndex((el: FavoriteList.RootObject) => el.id === action.payload.mediaId);

      newState[currentStatus][statusIndex].seriesData = action.payload.seriesData;
      newState.allFavorites[index].seriesData = action.payload.seriesData;

      return newState;
    case 'SET':
      return action.payload.favoriteList;
    case 'ADD':
      if (!action.payload.newFavoriteItem) return;
      if (!newState.allFavorites || newState.allFavorites.length < 1) {
        newState[newStatus] = [action.payload.newFavoriteItem];
        newState.allFavorites = [action.payload.newFavoriteItem];

        return newState;
      }

      if (newState[newStatus]?.length >= 1) {
        newState[newStatus] = [...newState[newStatus], action.payload.newFavoriteItem];
      } else {
        newState[newStatus] = [action.payload.newFavoriteItem];
      }

      newState.allFavorites = [...newState.allFavorites, action.payload.newFavoriteItem];

      return newState;
    default:
      throw new Error(`Unhandled  action type ${action.type}`);
  }
};
