import { useCallback, useEffect, useState } from 'react';
import { addFavoriteListItem, deleteFavoriteListApi, getFavoriteListApi, updateFavoriteListApi } from '../api/favoriteApi';
import { FavoriteList } from '../types/FavoriteList';
import { useFavoriteContext } from '../context/FavoriteContext';

export const useFavorite = () => {
  const { favoriteList, dispatchFavoriteList } = useFavoriteContext();

  const getFavoriteList = useCallback((userId: string | undefined) => {
    getFavoriteListApi(userId).then((value) => dispatchFavoriteList({ type: 'SET', payload: value.favoriteList }));
  }, []);

  const addFavoriteItem = useCallback((userId: string | undefined, mediaId: number, mediaType: string) => {
    const newFavoriteItem: FavoriteList.RootObject = {
      id: mediaId,
      addedDate: Date.now(),
      mediaType: mediaType,
      seriesData: {
        currentEpisode: 1,
        currentSeason: 0,
        siteToView: null,
      },
    };

    addFavoriteListItem(userId, newFavoriteItem).then((value) =>
      dispatchFavoriteList({
        type: 'ADD',
        payload: { newFavoriteItem: newFavoriteItem },
      })
    );
  }, []);

  const updateFavoriteList = useCallback((userId: string | undefined, mediaId: number, seriesData: FavoriteList.SeriesData) => {
    updateFavoriteListApi(userId, mediaId, seriesData).then();
    dispatchFavoriteList({ type: 'UPDATE', payload: { mediaId, seriesData } });
  }, []);

  const deleteFavoriteItem = useCallback((userId: string | undefined, mediaId: number) => {
    deleteFavoriteListApi(userId, mediaId).then(() => {
      dispatchFavoriteList({ type: 'REMOVE', payload: { mediaId } });
    });
  }, []);

  return { getFavoriteList, updateFavoriteList, deleteFavoriteItem, addFavoriteItem };
};
