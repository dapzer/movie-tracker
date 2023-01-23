import React, { FC, useState } from 'react';
import styles from './note.module.scss';
import { CheckMarkIcon, CloseIcon } from '@/components/ui/Icons';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  maxLength: number;
}

const Note: FC<Props> = ({ maxLength }) => {
  const [note, setNote] = useState('');
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['body']}>
      <textarea placeholder={t('tracking_menu.note')} value={note} onChange={(event) => setNote(event.target.value)}
                maxLength={maxLength} />

      <div className={styles['block']}>
        <span>{t('tracking_menu.max_note_length')} {note.length}/{maxLength}</span>
        <div className={styles['controls']}>
          <button>
            <CheckMarkIcon />
          </button>
          <button>
            <CloseIcon />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Note;
