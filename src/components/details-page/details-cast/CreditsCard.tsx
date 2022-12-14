import React, { FC } from 'react';
import { Person } from '../../../types/Person';
import UiCard from '../../ui/card/UiCard';
import LinkToDetails from '../../core/details/link-to-details/LinkToDetails';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  item: Person.Cast;
}

const CreditsCard: FC<Props> = ({ item }) => {
  const { t } = useTranslation('details');

  return (
    <UiCard
      title={item.title || item.name}
      image={item.poster_path}
      date={`${t('movie_details.release_date')} ${new Date(item.release_date || item.first_air_date).toLocaleDateString()}`}
      horizontal
      link={`/details/${item.media_type}/${item.id}`}
    >
      <ul>
        <li>
          {t('person_details.roles')} {item.character}
        </li>
      </ul>

      <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
    </UiCard>
  );
};

export default CreditsCard;
