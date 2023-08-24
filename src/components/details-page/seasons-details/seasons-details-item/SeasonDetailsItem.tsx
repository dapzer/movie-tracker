import { SeasonDetails } from '@/types/SeasonDetails';
import UiDetails from '@/components/ui/details/UiDetails';
import React from 'react';
import UiCard from '@/components/ui/card/UiCard';
import useTranslation from 'next-translate/useTranslation';
import styles from './seasons-details-item.module.scss';
import { UiSpoilerText } from '@/components/ui/spoiler-text/UiSpoilerText';
import { Typography } from '@/components/ui/typography/UiTypography';

interface SeasonDetailsItemProps {
  season: SeasonDetails.RootObject;
}

export const SeasonDetailsItem = ({ season }: SeasonDetailsItemProps) => {
  const { t, lang } = useTranslation('details');

  return (
    <UiDetails
      title={season.name}
      description={`${t('movie_details.episodes_count')} ${season.episodes.length}`}
      isLarge
      isOpenedDefault={season.season_number === 1}
    >
      {season.episodes.map((el) => (
        <UiCard
          horizontal
          key={el.id}
          image={el.still_path}
          title={el.name}
          date={`${t('movie_details.release_date')} ${new Date(el.air_date).toLocaleDateString(lang)}`}
        >
          <ul className={styles['list']}>
            {!!el.vote_average && (
              <li>
                {t('movie_details.user_score')}
                <Typography as="span" variant="listItem">
                  {' '}
                  {Number(el.vote_average.toFixed(1))}
                </Typography>
              </li>
            )}
            <li>
              {t('movie_details.episode_number')}:{' '}
              <Typography as="span" variant="listItem">
                {el.episode_number}
              </Typography>
            </li>
            {el.runtime && (
              <li>
                {t('movie_details.series_runtime')}{' '}
                <Typography as="span" variant="listItem">
                  {el.runtime} {t('movie_details.runtime_mins')}
                </Typography>
              </li>
            )}
            {el.overview && (
              <li>
                {t('movie_details.episode_description')}:{' '}
                <UiSpoilerText>
                  <Typography as="span" variant="listItem">
                    {el.overview}
                  </Typography>
                </UiSpoilerText>
              </li>
            )}
          </ul>
        </UiCard>
      ))}
    </UiDetails>
  );
};
