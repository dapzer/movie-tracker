import React, { FC } from 'react';
import styles from './status-selector.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '../../../hooks/useFavorite';
import UiDropdown from '../../ui/dropdown/UiDropdown';

interface Props {
  mediaType?: string;
  id: number;
  currentStatus: string;
}

const statuses = ['watchingNow', 'notViewed', 'waitNewPart', 'viewed'];

const StatusSelector: FC<Props> = ({ id, mediaType, currentStatus }) => {
  const { t } = useTranslation();
  const { handleFavorite, changeStatus } = useFavorite(id, currentStatus);

  return (
    <div className={`favorite-btn__movie-card-btn ${styles['content']} ui-dropdown__trigger`}>
      <span>{t('favoritePage:changeStatus')}</span>
      <UiDropdown>
        {statuses.map((el, index) => (
          <button key={`status-selector-${id}-${index}`} hidden={el === currentStatus} onClick={() => changeStatus(el)}>
            {t(`favoritePage:statuses.${el}`)}
          </button>
        ))}
        <button onClick={() => handleFavorite(id, `${mediaType}`)} className={styles['delete_btn']}>
          {t('buttons:delete_from_favorite')}
        </button>
      </UiDropdown>
    </div>
  );
};

export default StatusSelector;
