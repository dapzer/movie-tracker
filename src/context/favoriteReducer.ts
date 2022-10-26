import { FavoriteList } from '../types/FavoriteList';

export interface Actions {
  type?: string;
  payload: {
    seriesData?: FavoriteList.SeriesData;
    mediaId?: number;
    newFavoriteItem?: FavoriteList.RootObject;
  };
}

export const favoriteReducer = (state: FavoriteList.RootObject[], action: Actions) => {
  switch (action.type) {
    case 'REMOVE':
      return state.filter((el: FavoriteList.RootObject) => el.id !== action.payload.mediaId);
    case 'UPDATE':
      if (!action.payload.seriesData) return;
      const index = state.findIndex((el: FavoriteList.RootObject) => el.id === action.payload.mediaId);
      const arr = [...state];
      arr[index].seriesData = action.payload.seriesData;
      return arr;
    case 'SET':
      return action.payload;
    case 'ADD':
      return [...state, action.payload.newFavoriteItem];
    default:
      throw new Error(`Unhandled  action type ${action.type}`);
  }
};
