import React, { FC, useState } from 'react';
import { FavoriteList } from '@/types/FavoriteList';
import { Details } from '@/types/Details';
import useTranslation from 'next-translate/useTranslation';
import { SeriesControls } from '@/components/favorite-page/tracking-menu/series-controls/SeriesControls';
import { UiDetails } from '@/components/ui/details/UiDetails';
import styles from './tracking-menu.module.scss';
import { Note } from '@/components/favorite-page/tracking-menu/note/Note';
import { SiteToView } from '@/components/favorite-page/tracking-menu/site-to-view/SiteToView';
import { ContentNames } from '@/types/Enums';
import clsx from 'clsx';

interface Props {
  favoriteItem: FavoriteList.RootObject;
  details: Details.RootObject;
}

type Tab = 'information' | 'note';
const tabs: Tab[] = ['information', 'note'];

export const TrackingMenu: FC<Props> = ({ details, favoriteItem }) => {
  const [activeTab, setSetActiveTab] = useState<Tab>('information');
  const { t } = useTranslation('favoritePage');

  return (
    <UiDetails title={t('tracking_menu.title')}>
      <div className={styles['tabs']}>
        {tabs.map((el, index) => (
          <button
            key={`tab-${index}`}
            className={clsx({
              [styles['active']]: activeTab === el,
            })}
            onClick={() => setSetActiveTab(el)}
          >
            {t(`tracking_menu.${el}`)}
          </button>
        ))}
      </div>

      {activeTab === 'information' && (
        <>
          <SiteToView favoriteItem={favoriteItem} />
          {favoriteItem.mediaType === ContentNames.Series && <SeriesControls favoriteItem={favoriteItem} seasons={details.seasons} />}
        </>
      )}

      {activeTab === 'note' && <Note maxLength={250} favoriteItem={favoriteItem} />}
    </UiDetails>
  );
};
