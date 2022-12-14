import { useCallback, useEffect, useState } from 'react';
import { FavoriteList } from '../types/FavoriteList';
import { useSession } from 'next-auth/react';
import { StatusesNames } from '../types/StatusesNames';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addFavoriteListItemApi, deleteFavoriteListItemApi, updateFavoriteListItemApi } from '../redux/features/favoriteList/favoriteListThunk';
import {
  changeFavoriteListItemStatus,
  deleteFavoriteListItem,
  selectFavoriteList,
  updateFavoriteListItemSeriesData,
} from '../redux/features/favoriteList/favoriteListSlice';

export const useFavorite = (mediaId?: number) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const favoriteList = useAppSelector(selectFavoriteList);
  const [isFavorite, setIsFavorite] = useState(false);

  const addFavoriteItem = (mediaId: number, mediaType: string) => {
    if (!session?.user?.id) return;

    const newFavoriteItem: FavoriteList.RootObject = {
      id: mediaId,
      addedDate: Date.now(),
      mediaType: mediaType,
      currentStatus: StatusesNames.notViewed,
      seriesData: {
        currentEpisode: 1,
        currentSeason: 0,
        sitesToView: [],
      },
    };

    dispatch(addFavoriteListItemApi({ favoriteItem: newFavoriteItem, userId: session.user.id })).then(() => {
      toast.success(`${t(`toasts:${mediaType}SuccessAddedToFavorite`)}`);
    });
  };

  const updateFavoriteListSeriesData = (mediaId: number, seriesData: FavoriteList.SeriesData, mediaStatus: FavoriteList.StatusesNames) => {
    if (!session?.user?.id) return;

    dispatch(updateFavoriteListItemApi({ mediaId, seriesData, mediaStatus, userId: session.user.id })).then(() => {
      dispatch(updateFavoriteListItemSeriesData({ newSeriesData: seriesData, mediaId, mediaStatus }));
    });
  };

  const deleteFavoriteItem = (mediaId: number, mediaType: string) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    dispatch(deleteFavoriteListItemApi({ userId: session.user.id, mediaId })).then(() => {
      toast.success(`${t(`toasts:${mediaType}SuccessRemovedFromFavorite`)}`);
      dispatch(deleteFavoriteListItem({ mediaId, mediaStatus: favoriteItem.currentStatus }));
    });
  };

  const changeStatus = (newStatus: FavoriteList.StatusesNames) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    dispatch(
      updateFavoriteListItemApi({
        mediaId: favoriteItem.id,
        seriesData: favoriteItem.seriesData,
        mediaStatus: newStatus,
        userId: session.user.id,
      })
    ).then(() => {
      dispatch(changeFavoriteListItemStatus({ mediaId: favoriteItem.id, mediaStatus: favoriteItem.currentStatus, newStatus }));
      toast.success(`${t(`toasts:statusChanged`)}`);
    });
  };

  const checkOnFavorite = () => {
    setIsFavorite(favoriteList.allFavorites.some((el) => el.id === mediaId));
  };

  const handleFavorite = (mediaId: number, mediaType: string) => {
    if (isFavorite) {
      deleteFavoriteItem(mediaId, mediaType);
    } else {
      addFavoriteItem(mediaId, mediaType);
    }
  };

  const getFavoriteItem = useCallback((id: number) => {
    return favoriteList.allFavorites.find((el) => el.id === id);
  }, []);

  useEffect(() => {
    checkOnFavorite();
  }, [favoriteList, mediaId]);

  return {
    updateFavoriteList: updateFavoriteListSeriesData,
    deleteFavoriteItem,
    addFavoriteItem,
    checkOnFavorite,
    handleFavorite,
    isFavorite,
    getFavoriteItem,
    changeStatus,
  };
};
