import React, { FC } from 'react';
import styles from './status-selector.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '../../../hooks/useFavorite';

interface Props {
  mediaType?: string;
  id: number;
  currentStatus: string;
}

const statuses = ['viewed', 'watchingNow', 'notViewed', 'waitNewPart'];

const StatusSelector: FC<Props> = ({ id, mediaType, currentStatus }) => {
  const { t } = useTranslation();
  const { handleFavorite, changeStatus } = useFavorite(id, currentStatus);

  return (
    <div className={`favorite-btn__movie-card-btn ${styles['status-selector']}`}>
      <span>{t('favoritePage:changeStatus')}</span>
      <div className={styles['status-selector__tooltip']}>
        <div className={styles['status-selector__tooltip__content']}>
          {statuses.map((el, index) => (
            <button key={`status-selector-${id}-${index}`} hidden={el === currentStatus} onClick={() => changeStatus(currentStatus, el)}>
              {t(`favoritePage:statuses.${el}`)}
            </button>
          ))}
          <button onClick={() => handleFavorite(id, `${mediaType}`)} className={styles['status-selector__delete-btn']}>
            {t('buttons:delete_from_favorite')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusSelector;
