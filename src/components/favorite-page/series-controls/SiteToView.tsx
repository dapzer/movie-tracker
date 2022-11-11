import React, { FC, useState } from 'react';
import styles from './series-controls.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '../../../types/FavoriteList';
import { useFavorite } from '../../../hooks/useFavorite';

interface Props {
  favoriteData: FavoriteList.RootObject;
}

const SiteToView: FC<Props> = ({ favoriteData }) => {
  const { updateFavoriteList } = useFavorite();
  const { t } = useTranslation('favoritePage');
  const [editUrlValue, setEditUrlValue] = useState(favoriteData.seriesData.siteToView || '');
  const [isEdit, setIsEdit] = useState(false);
  const isHaveUrl = favoriteData.seriesData.siteToView;

  const cancelEdit = () => {
    setEditUrlValue(favoriteData.seriesData.siteToView!);
    setIsEdit(false);
  };

  const confirmlEdit = () => {
    setIsEdit(false);

    favoriteData.seriesData.siteToView = editUrlValue;

    updateFavoriteList(favoriteData.id, favoriteData.seriesData, favoriteData.currentStatus);
  };

  return (
    <div className={styles['series-controls__site-to-view']}>
      {isHaveUrl && !isEdit && (
        <div className={styles['series-controls__site-to-view__default']}>
          <a href={isHaveUrl} target="_blank" rel="noreferrer">
            {t('tracking_menu.site_to_view')}
          </a>
          <button onClick={() => setIsEdit(true)}>🖉</button>
        </div>
      )}

      {!isHaveUrl && !isEdit && (
        <div className={styles['series-controls__site-to-view__add']} onClick={() => setIsEdit(true)}>
          <button>{t('tracking_menu.site_to_view')}</button>
          <svg>
            <use href="/icon-add.svg#svg"></use>
          </svg>
        </div>
      )}

      {isEdit && (
        <div className={styles['series-controls__site-to-view__edit']}>
          <input
            type="text"
            value={editUrlValue}
            onChange={(event) => setEditUrlValue(event.target.value)}
            placeholder={t('tracking_menu.site_to_view_input')}
          />
          <button onClick={() => confirmlEdit()}>🗸</button>
          <button onClick={() => cancelEdit()}>✕</button>
        </div>
      )}
    </div>
  );
};

export default SiteToView;
