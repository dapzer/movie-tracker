import React, { FC, useEffect, useState } from 'react';
import styles from './search.module.scss';

interface Props {
  setSearchTerm: (value: string) => void;
}

const Search: FC<Props> = ({ setSearchTerm }) => {
  const [localSearchValue, serLocalSearchValue] = useState('');

  // Спустя n-секунд обновляем значение для поиска
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(localSearchValue);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchValue]);

  return (
    <div className={styles.search}>
      <h3>Найти фильм, сериал, персону...</h3>
      <input
        type="text"
        placeholder="Поиск"
        onChange={(event) => serLocalSearchValue(event.target.value)}
      />
    </div>
  );
};

export default Search;
