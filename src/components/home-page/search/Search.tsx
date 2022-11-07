import React, { FC, useEffect, useState } from 'react';
import styles from './search.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useSearchContext } from '../../../context/SearchContext';
import { isOnlySpaces } from '../../../utils/isOnlySpaces.helper';

interface Props {}

const Search: FC<Props> = () => {
  const { changeSearch, setCurrentPage, searchTerm, currentPage, updateRouter, clearQueries } = useSearchContext();
  const [localSearchValue, setLocalSearchValue] = useState<string | null>(null);
  const { t } = useTranslation('searchPage');

  // * Спустя n-секунд обновляем значение для поиска
  useEffect(() => {
    if (localSearchValue === null && !isOnlySpaces(searchTerm)) return updateRouter(searchTerm, currentPage);
    if (localSearchValue === null) return;
    const delayDebounceFn = setTimeout(() => {
      if (isOnlySpaces(localSearchValue) && isOnlySpaces(searchTerm)) return;
      setCurrentPage(1);
      if (isOnlySpaces(localSearchValue)) return clearQueries();
      changeSearch(localSearchValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchValue]);

  return (
    <div className={styles['search']}>
      <h3>{t('input_title')}</h3>
      <div className={styles['search__input']}>
        <input
          type="text"
          defaultValue={searchTerm}
          placeholder={t('input_placeholder')}
          onChange={(event) => setLocalSearchValue(event.target.value)}
        />
        <span>🔎︎</span>
      </div>
    </div>
  );
};

export default Search;
