import React, { FC } from 'react';
import styles from './note.module.scss';
import { CheckMarkIcon, CloseIcon } from '@/components/ui/Icons';
import useTranslation from 'next-translate/useTranslation';
import { useNote } from '@/hooks/useNote';
import { FavoriteList } from '@/types/FavoriteList';
import { Typography } from '@/components/ui/typography/UiTypography';

interface NoteProps {
  maxLength: number;
  favoriteItem: FavoriteList.RootObject;
}

export const Note = (props: NoteProps) => {
  const { maxLength, favoriteItem } = props;
  const { note, setNote, saveNote, cancelChanges } = useNote(favoriteItem);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['body']}>
      <textarea placeholder={t('tracking_menu.note')} value={note} onChange={(event) => setNote(event.target.value)} maxLength={maxLength} />

      <div className={styles['block']}>
        <Typography as="span" variant="textSmall">
          {t('tracking_menu.max_note_length')} {note.length}/{maxLength}
        </Typography>

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
