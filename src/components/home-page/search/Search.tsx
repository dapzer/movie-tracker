import React, { FC, Ref, useEffect, useRef, useState } from 'react';
import styles from './search.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { isOnlySpaces } from '@/utils/isOnlySpaces';
import { useSearch } from '@/hooks/useSearch';
import { useAppSelector } from '@/redux/hooks';
import { selectSearchParams } from '@/redux/features/searchParams/searchParamsSlice';

interface Props {
  searchTitleRef: Ref<HTMLInputElement> | null;
}

const Search: FC<Props> = ({ searchTitleRef }) => {
  const { changeSearch, updateRouter, clearQueries } = useSearch();
  const { searchTerm, currentPage } = useAppSelector(selectSearchParams);
  const [localSearchValue, setLocalSearchValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation('searchPage');

  // * Спустя n-секунд обновляем значение для поиска
  useEffect(() => {
    if (localSearchValue === null && !isOnlySpaces(searchTerm)) return updateRouter(searchTerm, currentPage);
    if (localSearchValue === null) return;
    const delayDebounceFn = setTimeout(() => {
      if (isOnlySpaces(localSearchValue) && isOnlySpaces(searchTerm)) return;
      if (isOnlySpaces(localSearchValue)) return clearQueries();
      changeSearch(localSearchValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchValue]);

  return (
    <div className={styles['content']}>
      <h3 ref={searchTitleRef}>{t('input_title')}</h3>
      <div className={styles['input_block']}>
        <input
          type="text"
          ref={inputRef}
          defaultValue={searchTerm}
          placeholder={t('input_placeholder')}
          onChange={(event) => setLocalSearchValue(event.target.value)}
        />
        <svg className={styles['search_logo']}>
          <use href="/icon-search.svg#svg"></use>
        </svg>
        {searchTerm.length > 0 && (
          <button
            className={styles['clear_btn']}
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.value = '';
              clearQueries();
            }}
          >
            <svg>
              <use href="/icon-close.svg#svg"></use>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
