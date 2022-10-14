import React, { FC } from 'react';
import styles from './details.module.scss';
import { Credits } from '../../../types/Credits';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { personImagesApi } from '../../../api/searchApi';
import { PersonImages } from '../../../types/PersonImages';
import { arrayToString } from '../../../utils/arrayToString.helper';

interface Props {
  person: Credits.Cast;
}

const DetailsPerson: FC<Props> = ({ person }) => {
  const { data: images } = useQuery<PersonImages.RootObject>(
    [
      'getCredits',
      {
        person_id: person.id,
      },
    ],
    personImagesApi
  );

  return (
    <div className={styles['details__person']}>
      <div className={styles['details__person__image']}>
        <Image
          src={
            images && images.profiles.length > 0
              ? `https://image.tmdb.org/t/p/original${images.profiles[0]?.file_path}`
              : '/defaultPoster.svg'
          }
          width="100"
          height="150"
          objectFit="contain"
          sizes="320"
          alt="Brand logo"
        />
      </div>

      <div className={styles['details__person__info']}>
        <h3>{person.name}</h3>
        <ul>
          {person?.roles?.length > 0 ? (
            <li>Роли: {arrayToString(person.roles, 'character')}</li>
          ) : (
            <li>Роль: {person.character}</li>
          )}

          {person.total_episode_count && <li>В {person.total_episode_count} эпизодах</li>}
        </ul>
      </div>
    </div>
  );
};

export default DetailsPerson;
