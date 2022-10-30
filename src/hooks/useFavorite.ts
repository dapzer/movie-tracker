import { useCallback, useEffect, useState } from 'react';
import { addFavoriteListItem, deleteFavoriteListApi, getFavoriteListApi, updateFavoriteListApi } from '../api/favoriteApi';
import { FavoriteList } from '../types/FavoriteList';
import { useFavoriteContext } from '../context/FavoriteContext';
import { useSession } from 'next-auth/react';
import { StatusesNames } from '../types/StatusesNames';

export const useFavorite = (mediaId?: number, currentStatus?: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { favoriteList, dispatchFavoriteList } = useFavoriteContext();
  const { data: session } = useSession();

  const getFavoriteList = useCallback((userId: string | undefined) => {
    getFavoriteListApi(userId).then((value) => {
      dispatchFavoriteList({ type: 'SET', payload: { favoriteList: value.favoriteList } });
    });
  }, []);

  const addFavoriteItem = (userId: string | undefined, mediaId: number, mediaType: string) => {
    const newFavoriteItem: FavoriteList.RootObject = {
      id: mediaId,
      addedDate: Date.now(),
      mediaType: mediaType,
      currentStatus: StatusesNames.notViewed,
      seriesData: {
        currentEpisode: 1,
        currentSeason: 0,
        siteToView: null,
      },
    };

    addFavoriteListItem(userId, newFavoriteItem).then(() =>
      dispatchFavoriteList({
        type: 'ADD',
        payload: { newFavoriteItem },
      })
    );
  };

  const updateFavoriteList = (mediaId: number, seriesData: FavoriteList.SeriesData, status?: string) => {
    updateFavoriteListApi(session?.user?.id, mediaId, seriesData, status || currentStatus).then(() => {
      dispatchFavoriteList({ type: 'UPDATE', payload: { mediaId, seriesData, currentStatus: status || currentStatus } });
    });
  };

  const deleteFavoriteItem = (userId: string | undefined, mediaId: number) => {
    deleteFavoriteListApi(userId, mediaId).then(() => {
      dispatchFavoriteList({ type: 'REMOVE', payload: { mediaId, currentStatus } });
    });
  };

  const changeStatus = (newStatus: string) => {
    const item = getFavoriteItem(mediaId!);
    if (!item) return;

    updateFavoriteListApi(session?.user?.id, mediaId, item?.seriesData, newStatus).then(() => {
      dispatchFavoriteList({ type: 'REMOVE', payload: { mediaId, currentStatus: item.currentStatus } });
      item.currentStatus = newStatus;
      dispatchFavoriteList({ type: 'ADD', payload: { mediaId, newStatus, newFavoriteItem: item } });
    });
  };

  const checkOnFavorite = () => {
    setIsFavorite(favoriteList?.allFavorites && favoriteList.allFavorites.some((el) => el.id === mediaId));
  };

  const handleFavorite = (id: number, mediaType: string) => {
    if (isFavorite) {
      deleteFavoriteItem(session?.user?.id, id);
    } else {
      addFavoriteItem(session?.user?.id, id, mediaType);
    }
  };

  const getFavoriteItem = useCallback((id: number) => {
    return favoriteList.allFavorites.find((el) => el.id === id);
  }, []);

  useEffect(() => {
    checkOnFavorite();
  }, [favoriteList]);

  return {
    getFavoriteList,
    updateFavoriteList,
    deleteFavoriteItem,
    addFavoriteItem,
    checkOnFavorite,
    handleFavorite,
    isFavorite,
    getFavoriteItem,
    changeStatus,
  };
};
