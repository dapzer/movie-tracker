import React, { FC, useState } from 'react';
import { LocalStorageMovie } from '../../../types/LocalStorageMovie';
import styles from './series-controls.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  storageData: LocalStorageMovie.RootObject;
}

const SiteToView: FC<Props> = ({ storageData }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editUrlValue, setEditUrlValue] = useState(storageData.seriesInfo.siteToView);
  const { t } = useTranslation('favoritePage');
  const isHaveUrl = storageData.seriesInfo.siteToView;

  const cancelEdit = () => {
    setIsEdit(false);
    setEditUrlValue('');
  };

  const confirmlEdit = () => {
    setIsEdit(false);
    setEditUrlValue('');

    storageData.seriesInfo.siteToView = editUrlValue;

    localStorage.setItem(storageData.id.toString(), JSON.stringify(storageData));
  };

  return (
    <div className={styles['series-controls__site-to-view']}>
      {isHaveUrl && !isEdit && (
        <div className={styles['series-controls__site-to-view__default']}>
          <a href={isHaveUrl} target="_blank">
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
          <input type="text" value={editUrlValue} onChange={(event) => setEditUrlValue(event.target.value)} placeholder={t('tracking_menu.site_to_view_input')} />
          <button onClick={() => confirmlEdit()}>🗸</button>
          <button onClick={() => cancelEdit()}>✕</button>
        </div>
      )}
    </div>
  );
};

export default SiteToView;
