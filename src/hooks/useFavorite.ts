import { useCallback, useEffect, useState } from 'react';
import { addFavoriteListItem, deleteFavoriteListApi, getFavoriteListApi, updateFavoriteListApi } from '../api/favoriteApi';
import { FavoriteList } from '../types/FavoriteList';
import { useFavoriteContext } from '../context/FavoriteContext';
import { useSession } from 'next-auth/react';

export const useFavorite = (mediaId?: number) => {
  const { favoriteList, dispatchFavoriteList } = useFavoriteContext();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const getFavoriteList = useCallback((userId: string | undefined) => {
    getFavoriteListApi(userId).then((value) => {
      if (value?.favoriteList?.length >= 1) {
        dispatchFavoriteList({ type: 'SET', payload: value.favoriteList });
      }
    });
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

  const updateFavoriteList = useCallback((mediaId: number, seriesData: FavoriteList.SeriesData) => {
    updateFavoriteListApi(session?.user?.id, mediaId, seriesData).then();
    dispatchFavoriteList({ type: 'UPDATE', payload: { mediaId, seriesData } });
  }, []);

  const deleteFavoriteItem = useCallback((userId: string | undefined, mediaId: number) => {
    deleteFavoriteListApi(userId, mediaId).then(() => {
      dispatchFavoriteList({ type: 'REMOVE', payload: { mediaId } });
    });
  }, []);

  const checkOnFavorite = () => {
    setIsFavorite(favoriteList && favoriteList.some((el) => el.id === mediaId));
  };

  const handleFavorite = (id: number, mediaType: string) => {
    if (isFavorite) {
      deleteFavoriteItem(session?.user?.id, id);
    } else {
      addFavoriteItem(session?.user?.id, id, mediaType);
    }
  };

  useEffect(() => {
    checkOnFavorite();
  }, [favoriteList]);

  const getFavoriteItem = (id: number) => {
    return favoriteList.find((el) => el.id === id);
  };

  return { getFavoriteList, updateFavoriteList, deleteFavoriteItem, addFavoriteItem, checkOnFavorite, handleFavorite, isFavorite, getFavoriteItem };
};
