import { useEffect, useState } from 'react';
import { FavoriteList } from '@/types/FavoriteList';
import { useSession } from 'next-auth/react';
import { StatusesNames } from '@/types/Enums';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addFavoriteListItemApi, deleteFavoriteListItemApi, updateFavoriteListItemApi } from '@/redux/features/favoriteList/favoriteListThunk';
import {
  changeFavoriteListItemStatus,
  deleteFavoriteListItem,
  selectFavoriteList,
  updateFavoriteListItem,
} from '@/redux/features/favoriteList/favoriteListSlice';

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
      trackingData: {
        currentStatus: StatusesNames.notViewed,
        sitesToView: [],
        seriesInfo: {
          currentSeason: 0,
          currentEpisode: 1,
        },
      },
    };

    dispatch(addFavoriteListItemApi({ favoriteItem: newFavoriteItem, userId: session.user.id })).then(() => {
      toast.success(`${t(`toasts:${mediaType}SuccessAddedToFavorite`)}`);
    });
  };

  const deleteFavoriteItem = (mediaId: number, mediaType: string) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    dispatch(deleteFavoriteListItemApi({ userId: session.user.id, mediaId })).then(() => {
      toast.success(`${t(`toasts:${mediaType}SuccessRemovedFromFavorite`)}`);
      dispatch(deleteFavoriteListItem({ mediaId, mediaStatus: favoriteItem.trackingData.currentStatus }));
    });
  };

  const updateFavoriteItem = (mediaId: number, trackingData: FavoriteList.TrackingData) => {
    if (!session?.user?.id) return;

    dispatch(
      updateFavoriteListItemApi({
        mediaId: mediaId,
        trackingData,
        userId: session.user.id,
      })
    ).then(() => {
      dispatch(
        updateFavoriteListItem({
          mediaId,
          newTrackingData: trackingData,
          mediaStatus: trackingData.currentStatus,
        })
      );
    });
  };

  const changeStatus = (newStatus: FavoriteList.StatusesNames) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    dispatch(
      updateFavoriteListItemApi({
        mediaId: favoriteItem.id,
        trackingData: {
          ...favoriteItem.trackingData,
          currentStatus: newStatus,
        },
        userId: session.user.id,
      })
    ).then(() => {
      dispatch(
        changeFavoriteListItemStatus({
          mediaId: favoriteItem.id,
          mediaStatus: favoriteItem.trackingData.currentStatus,
          newStatus,
        })
      );
      toast.success(`${t(`toasts:statusChanged`)}`);
    });
  };

  const handleFavorite = (mediaId: number, mediaType: string) => {
    if (isFavorite) {
      deleteFavoriteItem(mediaId, mediaType);
    } else {
      addFavoriteItem(mediaId, mediaType);
    }
  };

  const checkOnFavorite = () => {
    setIsFavorite(favoriteList.allFavorites.some((el) => el.id === mediaId));
  };

  const getFavoriteItem = (id: number) => {
    return favoriteList.allFavorites.find((el) => el.id === id);
  };

  useEffect(() => {
    checkOnFavorite();
  }, [favoriteList, mediaId]);

  return {
    updateFavoriteItem,
    deleteFavoriteItem,
    addFavoriteItem,
    checkOnFavorite,
    handleFavorite,
    isFavorite,
    getFavoriteItem,
    changeStatus,
  };
};
