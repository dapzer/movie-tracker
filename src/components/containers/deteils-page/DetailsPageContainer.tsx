import { Person } from '@/types/Person';
import { MovieDetails } from '@/components/details-page/movie-details/MovieDetails';
import { Details as DetailsType } from '@/types/Details';
import { ContentNames } from '@/types/Enums';
import { PersonDetails } from '@/components/details-page/person-details/PersonDetails';
import styles from './details.module.scss';
import { BackBtn } from '@/components/core/back-btn/BackBtn';

interface DetailsPageContainerProps {
  details: Person.RootObject & DetailsType.RootObject;
  mediaType: string;
  locale: string;
}

export const DetailsPageContainer = (props: DetailsPageContainerProps) => {
  const { mediaType, details } = props;

  return (
    <div className={'container'}>
      <BackBtn />

      {mediaType === ContentNames.Person ? (
        <PersonDetails initialData={details as Person.RootObject} personId={details.id} />
      ) : (
        <MovieDetails initialData={details as DetailsType.RootObject} mediaType={mediaType} mediaId={details.id} />
      )}
    </div>
  );
};
