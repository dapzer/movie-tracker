import { useEffect, useState } from 'react';
import { FavoriteList } from '@/types/FavoriteList';
import { useSession } from 'next-auth/react';
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
  const isGettingFavoriteList = useAppSelector((state) => state.favoriteList.isGettingFavoriteList);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(isGettingFavoriteList);
  }, [isGettingFavoriteList]);

  const addFavoriteItem = (mediaId: number, mediaType: string) => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    dispatch(addFavoriteListItemApi({ mediaId, mediaType, userId: session.user.id }))
      .unwrap()
      .then(() => {
        toast.success(`${t(`toasts:${mediaType}SuccessAddedToFavorite`)}`);
        setIsLoading(false);
      });
  };

  const deleteFavoriteItem = (mediaId: number, mediaType: string) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    setIsLoading(true);
    dispatch(deleteFavoriteListItemApi({ userId: session.user.id, mediaId }))
      .unwrap()
      .then(() => {
        dispatch(deleteFavoriteListItem({ mediaId, mediaStatus: favoriteItem.trackingData.currentStatus }));
        toast.success(`${t(`toasts:${mediaType}SuccessRemovedFromFavorite`)}`);
        setIsLoading(false);
      });
  };

  const updateFavoriteItem = (mediaId: number, trackingData: FavoriteList.TrackingData, successToast?: string) => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    dispatch(
      updateFavoriteListItemApi({
        mediaId: mediaId,
        trackingData,
        userId: session.user.id,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          updateFavoriteListItem({
            mediaId,
            newTrackingData: trackingData,
            mediaStatus: trackingData.currentStatus,
          })
        );
        if (successToast) {
          toast.success(successToast);
          setIsLoading(false);
        }
      });
  };

  const changeStatus = (newStatus: FavoriteList.StatusesNames) => {
    const favoriteItem = getFavoriteItem(mediaId!);
    if (!session?.user?.id || !favoriteItem) return;

    setIsLoading(true);
    dispatch(
      updateFavoriteListItemApi({
        mediaId: favoriteItem.id,
        trackingData: {
          ...favoriteItem.trackingData,
          currentStatus: newStatus,
        },
        userId: session.user.id,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          changeFavoriteListItemStatus({
            mediaId: favoriteItem.id,
            mediaStatus: favoriteItem.trackingData.currentStatus,
            newStatus,
          })
        );
        setIsLoading(false);
        toast.success(`${t(`toasts:statusChanged`)}`);
      });
  };

  const handleFavorite = (mediaId: number, mediaType: string) => {
    if (isLoading) return;

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
    isLoading,
    getFavoriteItem,
    changeStatus,
  };
};
