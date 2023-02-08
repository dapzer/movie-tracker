import React, { FC } from 'react';
import { Credits } from '@/types/Credits';
import { ContentNames } from '@/types/Enums';
import { arrayToString } from '@/utils/arrayToString';
import LinkToDetails from '@/components/core/details/link-to-details/LinkToDetails';
import UiCard from '@/components/ui/card/UiCard';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  item: Credits.Cast;
}

const CastCard: FC<Props> = ({ item }) => {
  const { t } = useTranslation('details');

  return (
    <UiCard title={item.name} image={item.profile_path} horizontal link={`/details/${ContentNames.Person}/${item.id}`}>
      <ul>
        {item.total_episode_count && (
          <li>
            {t('movie_details.actors_episodesCount', {
              episodes: item.total_episode_count,
            })}
          </li>
        )}

        {!!item?.roles?.length ? (
          <li>
            {t('movie_details.actors_roles')} {arrayToString(item.roles, 'character')}
          </li>
        ) : (
          <li>
            {t('movie_details.actors_roles')} {item.character}
          </li>
        )}
      </ul>

      <LinkToDetails mediaId={item.id} mediaType={ContentNames.Person} />
    </UiCard>
  );
};

export default CastCard;
