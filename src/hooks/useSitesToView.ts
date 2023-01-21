import { FavoriteList } from '../types/FavoriteList';
import { useFavorite } from './useFavorite';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { isOnlySpaces } from '../utils/isOnlySpaces';

export const useSitesToView = (favoriteItem: FavoriteList.RootObject) => {
  const { updateFavoriteItem } = useFavorite();
  const { t } = useTranslation('favoritePage');
  const [editUrlValue, setEditUrlValue] = useState('');
  const [editUrlIndex, setEditUrlIndex] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  let sitesToView = [...favoriteItem.trackingData.sitesToView];

  const cancelEdit = () => {
    setEditUrlValue('');
    setIsEdit(false);
  };

  const startEdit = (index: number | null, currentValue: string) => {
    if (sitesToView.length >= 3 && index === null) {
      return toast.error(`${t('tracking_menu.site_to_view_limit')}`);
    }
    setIsEdit(true);
    setEditUrlValue(currentValue);
    setEditUrlIndex(index);
  };

  const confirmlEdit = () => {
    setIsEdit(false);
    const newSite = { url: editUrlValue };

    if (isOnlySpaces(editUrlValue) && editUrlIndex) {
      sitesToView?.splice(editUrlIndex - 1, 1);
    } else if (isOnlySpaces(editUrlValue)) {
      return setEditUrlValue('');
    } else if (!editUrlIndex) {
      sitesToView.push(newSite);
    } else if (editUrlIndex !== null) {
      sitesToView[editUrlIndex - 1] = newSite;
    }

    setEditUrlIndex(null);
    setEditUrlValue('');
    updateFavoriteItem(favoriteItem.id, {
      ...favoriteItem.trackingData,
      sitesToView,
    });
  };

  return {
    cancelEdit,
    startEdit,
    sitesToView,
    confirmlEdit,
    isEdit,
    editUrlIndex,
    editUrlValue,
    setEditUrlValue,
  };
};
