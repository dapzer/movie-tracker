import React, { FC } from 'react';
import { SearchItem } from '../../../types/SearchItem';
import styles from './search-results.module.scss';
import Image from 'next/image';

interface Props {
  item: SearchItem;
}

const SearchResultsItem: FC<Props> = ({ item }) => {
  const release = new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString();

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemCardImage}>
        <Image
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/original${item.poster_path}`
              : '/defaultPoster.svg'
          }
          width="100vw"
          height="100vw"
          sizes="100vw"
          layout="responsive"
        />
      </div>

      <div className={styles.itemCardInfo}>
        <span className={styles.itemCardRelease}>Дата выхода: {release}</span>
        <p className={styles.itemCardTitle}>{item.title || item.name}</p>
      </div>
    </div>
  );
};

export default SearchResultsItem;
