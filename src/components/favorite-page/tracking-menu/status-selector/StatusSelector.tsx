import React, { FC } from 'react';
import styles from './status-selector.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '@/hooks/useFavorite';
import { UiDropdown } from '@/components/ui/dropdown/UiDropdown';
import { FavoriteList } from '@/types/FavoriteList';
import { ListIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {
  mediaType: string;
  id: number;
  currentStatus: FavoriteList.StatusesNames;
  trigger?: React.ReactNode;
  dropdownStyles?: string;
}

const statuses: FavoriteList.StatusesNames[] = ['watchingNow', 'notViewed', 'waitNewPart', 'viewed'];

export const StatusSelector: FC<Props> = ({ id, mediaType, currentStatus, trigger, dropdownStyles }) => {
  const { t } = useTranslation();
  const { handleFavorite, changeStatus, isFavorite, isLoading } = useFavorite(id);

  return (
    <div
      className={clsx('ui-dropdown__trigger', styles['content'], {
        [styles['body']]: !trigger,
      })}
    >
      {trigger ? (
        trigger
      ) : (
        <Typography as="span" variant="textSmall">
          <ListIcon /> {t('favoritePage:changeStatus')}
        </Typography>
      )}
      {isFavorite && (
        <UiDropdown containerClass={dropdownStyles}>
          {statuses.map((el, index) => (
            <button
              key={`status-selector-${id}-${index}`}
              hidden={el === currentStatus}
              onClick={() => changeStatus(el)}
              className={clsx(styles['status'], {
                [styles['status_loading']]: isLoading,
              })}
            >
              {t(`favoritePage:statuses.${el}`)}
            </button>
          ))}
          <button
            onClick={() => handleFavorite(id, mediaType)}
            className={clsx(styles['status'], styles['delete_btn'], { [styles['status_loading']]: isLoading })}
          >
            {t('buttons:delete_from_favorite')}
          </button>
        </UiDropdown>
      )}
    </div>
  );
};
