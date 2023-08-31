import React, { FC } from 'react';
import styles from './series-controls.module.scss';
import { Details } from '@/types/Details';
import { useSeriesControls } from '@/hooks/useSeriesControls';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '@/types/FavoriteList';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  favoriteItem: FavoriteList.RootObject;
  seasons: Details.Season[];
}

export const SeriesControls: FC<Props> = ({ favoriteItem, seasons }) => {
  const { generateEpisodesList, setCurrentEpisode, currentEpisode, currentSeason, handleSeason } = useSeriesControls(favoriteItem);
  const { t } = useTranslation('favoritePage');

  return (
    <div className={styles['content']}>
      <div className={styles['item']}>
        <Typography>{t('tracking_menu.current_season')}</Typography>
        <select value={currentSeason} onChange={(event) => handleSeason(Number(event.target.value))} name="Season">
          {seasons.map((season, index) => (
            <option key={`season-${season.season_number}-for${favoriteItem.id}`} value={index}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['item']}>
        <Typography>{t('tracking_menu.current_episode')}</Typography>
        <select value={currentEpisode} onChange={(event) => setCurrentEpisode(Number(event.target.value))} name="Episode">
          {generateEpisodesList(seasons[currentSeason].episode_count).map((episode) => (
            <option key={`episode-${episode}-for${favoriteItem.id}`} value={episode}>
              {episode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
