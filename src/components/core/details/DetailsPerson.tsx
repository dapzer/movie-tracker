import React, { FC } from 'react';
import styles from './details.module.scss';
import { Credits } from '../../../types/Credits';
import Image from 'next/image';
import { arrayToString } from '../../../utils/arrayToString.helper';

interface Props {
  person: Credits.Cast;
}

const DetailsPerson: FC<Props> = ({ person }) => {
  return (
    <div className={styles['details__person']}>
      <div className={styles['details__person__image']}>
        <Image
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/original${person.profile_path}`
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
