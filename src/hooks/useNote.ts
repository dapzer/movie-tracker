import { FavoriteList } from '@/types/FavoriteList';
import { useState } from 'react';
import { useFavorite } from '@/hooks/useFavorite';
import useTranslation from 'next-translate/useTranslation';

export const useNote = (favoriteItem: FavoriteList.RootObject) => {
  const [note, setNote] = useState(favoriteItem.trackingData.note);
  const { t } = useTranslation('toasts');
  const { updateFavoriteItem } = useFavorite();

  const saveNote = () => {
    if (note === favoriteItem.trackingData.note) return;

    updateFavoriteItem(favoriteItem.id, {
      ...favoriteItem.trackingData,
      note: note,
    }, t('noteSuccessUpdate'));
  };

  const cancelChanges = () => {
    setNote(favoriteItem.trackingData.note);
  };

  return {
    note,
    setNote,
    saveNote,
    cancelChanges,
  };
};
