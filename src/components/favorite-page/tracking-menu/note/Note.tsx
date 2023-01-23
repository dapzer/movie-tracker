import React, { FC } from 'react';
import styles from './note.module.scss';
import { CheckMarkIcon, CloseIcon } from '@/components/ui/Icons';
import useTranslation from 'next-translate/useTranslation';
import { useNote } from '@/hooks/useNote';
import { FavoriteList } from '@/types/FavoriteList';

interface Props {
  maxLength: number;
  favoriteItem: FavoriteList.RootObject;
}

const Note: FC<Props> = ({ maxLength, favoriteItem }) => {
  const { note, setNote, saveNote, cancelChanges } = useNote(favoriteItem);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['body']}>
      <textarea placeholder={t('tracking_menu.note')}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={maxLength} />

      <div className={styles['block']}>
        <span>{t('tracking_menu.max_note_length')} {note.length}/{maxLength}</span>

        <div className={styles['controls']}>
          <button onClick={saveNote}>
            <CheckMarkIcon />
          </button>
          <button onClick={cancelChanges}>
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Note;
