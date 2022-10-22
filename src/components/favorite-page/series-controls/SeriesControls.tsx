import React, { FC, useEffect, useState } from 'react';
import { LocalStorageMovie } from '../../../types/LocalStorageMovie';
import styles from './series-controls.module.scss';
import { Details } from '../../../types/Details';
import { useSeriesControls } from '../../../hooks/useSeriesControls';
import SiteToView from './SiteToView';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  storageData: LocalStorageMovie.RootObject;
  seasons: Details.Season[];
}

const SeriesControls: FC<Props> = ({ storageData, seasons }) => {
  const { generateEpisodesList, setCurrentEpisode, currentEpisode, currentSeason, handleSeason } = useSeriesControls(storageData.id, seasons);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['series-controls']}>
      <div className={styles['series-controls__item']}>
        <SiteToView storageData={storageData} />
      </div>

      <div className={styles['series-controls__item']}>
        <p>{t('tracking_menu.current_season')}</p>
        <select value={currentSeason} onChange={(event) => handleSeason(event.target.value)} name="Season">
          {seasons.map((season, index) => (
            <option key={season.season_number} value={index}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['series-controls__item']}>
        <p>{t('tracking_menu.current_episode')}</p>
        <select value={currentEpisode} onChange={(event) => setCurrentEpisode(event.target.value)} name="Episode">
          {generateEpisodesList(seasons[currentSeason].episode_count).map((episode) => (
            <option key={episode} value={episode}>
              {episode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SeriesControls;
