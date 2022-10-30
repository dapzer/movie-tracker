import React, { FC } from 'react';
import styles from './series-controls.module.scss';
import { Details } from '../../../types/Details';
import { useSeriesControls } from '../../../hooks/useSeriesControls';
import SiteToView from './SiteToView';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '../../../types/FavoriteList';

interface Props {
  favoriteData: FavoriteList.RootObject;
  seasons: Details.Season[];
}

const SeriesControls: FC<Props> = ({ favoriteData, seasons }) => {
  const { generateEpisodesList, setCurrentEpisode, currentEpisode, currentSeason, handleSeason } = useSeriesControls(favoriteData);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['series-controls']}>
      <div className={styles['series-controls__item']}>
        <SiteToView favoriteData={favoriteData} />
      </div>

      <div className={styles['series-controls__item']}>
        <p>{t('tracking_menu.current_season')}</p>
        <select value={currentSeason} onChange={(event) => handleSeason(Number(event.target.value))} name="Season">
          {seasons.map((season, index) => (
            <option key={`season-${season.season_number}-for${favoriteData.id}`} value={index}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['series-controls__item']}>
        <p>{t('tracking_menu.current_episode')}</p>
        <select value={currentEpisode} onChange={(event) => setCurrentEpisode(Number(event.target.value))} name="Episode">
          {generateEpisodesList(seasons[currentSeason].episode_count).map((episode) => (
            <option key={`episode-${episode}-for${favoriteData.id}`} value={episode}>
              {episode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SeriesControls;
