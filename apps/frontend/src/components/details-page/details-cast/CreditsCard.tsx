import { Person } from '@/types/Person';
import { UiCard } from '@/components/ui/card/UiCard';
import { LinkToDetails } from '@/components/core/details/link-to-details/LinkToDetails';
import useTranslation from 'next-translate/useTranslation';

interface CreditsCardProps {
  item: Person.Cast;
}

export const CreditsCard = (props: CreditsCardProps) => {
  const { item } = props;
  const { t, lang } = useTranslation('details');

  return (
    <UiCard
      title={item.title || item.name}
      image={item.poster_path}
      date={`${t('movie_details.release_date')} ${new Date(item.release_date || item.first_air_date).toLocaleDateString(lang)}`}
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