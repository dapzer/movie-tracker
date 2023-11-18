import { FavoriteList } from '@/types/FavoriteList';

export const getFavoriteItemIndexes = (state: FavoriteList.StatusedObject, id: number, status: FavoriteList.StatusesNames) => {
  const indexInStatusedList = state[status].findIndex((el) => el.id === id);
  const indexInAllFavorites = state.allFavorites.findIndex((el) => el.id === id);

  return {
    indexInAllFavorites,
    indexInStatusedList,
  };
};
