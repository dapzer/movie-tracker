import React, { FC } from 'react';
import styles from './series-controls.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '../../../types/FavoriteList';
import { useSitesToView } from '../../../hooks/useSitesToView';

interface Props {
  favoriteData: FavoriteList.RootObject;
}

const SiteToView: FC<Props> = ({ favoriteData }) => {
  const { sitesToView, startEdit, isEdit, editUrlIndex, editUrlValue, confirmlEdit, cancelEdit, setEditUrlValue } = useSitesToView(favoriteData);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['series-controls__site-to-view']}>
      {sitesToView &&
        sitesToView?.length > 0 &&
        sitesToView.map((item, index) => (
          <div
            key={`site-${index}`}
            className={`${styles['series-controls__site-to-view__default']} ${styles['series-controls__site-to-view__item']}`}
            style={{ '--order': index + 1 } as React.CSSProperties}
          >
            <a href={item.url} target="_blank" rel="noreferrer">
              {t('tracking_menu.site_to_view')} #{index + 1}
            </a>
            <button onClick={() => startEdit(index + 1, item.url)}>🖉</button>
          </div>
        ))}

      {!isEdit && (
        <div
          className={`${styles['series-controls__site-to-view__add']} ${styles['series-controls__site-to-view__item']}`}
          onClick={() => startEdit(null, '')}
          style={{ '--order': sitesToView?.length || 1 } as React.CSSProperties}
        >
          <button>{t('tracking_menu.add_site_to_view')}</button>
          <svg>
            <use href="/icon-add.svg#svg"></use>
          </svg>
        </div>
      )}

      {isEdit && (
        <div
          className={`${styles['series-controls__site-to-view__edit']} ${styles['series-controls__site-to-view__item']}`}
          style={{ '--order': editUrlIndex || sitesToView?.length || 1 } as React.CSSProperties}
        >
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
