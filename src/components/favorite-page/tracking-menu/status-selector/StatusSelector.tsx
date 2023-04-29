import React, { FC } from 'react';
import styles from './status-selector.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '@/hooks/useFavorite';
import UiDropdown from '@/components/ui/dropdown/UiDropdown';
import { FavoriteList } from '@/types/FavoriteList';
import { ListIcon } from '@/components/ui/Icons';

interface Props {
  mediaType: string;
  id: number;
  currentStatus: FavoriteList.StatusesNames;
  trigger?: React.ReactNode;
  dropdownStyles?: string
}

const statuses: FavoriteList.StatusesNames[] = ['watchingNow', 'notViewed', 'waitNewPart', 'viewed'];

const StatusSelector: FC<Props> = ({ id, mediaType, currentStatus, trigger, dropdownStyles }) => {
  const { t } = useTranslation();
  const { handleFavorite, changeStatus, isFavorite } = useFavorite(id);

  return (
    <div className={`${!trigger ? styles['body'] : ''} ${styles['content']} ui-dropdown__trigger`}>
      {trigger ? trigger : <span><ListIcon /> {t('favoritePage:changeStatus')}</span>}
      {isFavorite && (
        <UiDropdown containerClass={dropdownStyles}>
          {statuses.map((el, index) => (
            <button key={`status-selector-${id}-${index}`} hidden={el === currentStatus}
                    onClick={() => changeStatus(el)} className={styles['status']}>
              {t(`favoritePage:statuses.${el}`)}
            </button>
          ))}
          <button onClick={() => handleFavorite(id, mediaType)}
                  className={`${styles['status']} ${styles['delete_btn']}`}>
            {t('buttons:delete_from_favorite')}
          </button>
        </UiDropdown>
      )}
    </div>
  );
};

export default StatusSelector;
