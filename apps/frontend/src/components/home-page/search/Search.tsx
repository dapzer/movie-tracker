import { Ref, useEffect, useRef, useState } from 'react';
import styles from './search.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { isOnlySpaces } from '@/utils/isOnlySpaces';
import { useSearch } from '@/hooks/useSearch';
import { useAppSelector } from '@/redux/hooks';
import { selectSearchParams } from '@/redux/features/searchParams/searchParamsSlice';
import { CloseIcon, SearchIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';

interface SearchProps {
  searchTitleRef: Ref<HTMLInputElement> | null;
}

export const Search = (props: SearchProps) => {
  const { searchTitleRef } = props;
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
    <section className={styles['content']}>
      <Typography ref={searchTitleRef} as="h3" variant="title3">
        {t('input_title')}
      </Typography>
      <div className={styles['input_block']}>
        <input
          type="text"
          ref={inputRef}
          defaultValue={searchTerm}
          placeholder={t('input_placeholder')}
          onChange={(event) => setLocalSearchValue(event.target.value)}
        />
        <div className={styles['search_logo']}>
          <SearchIcon />
        </div>
        {!!searchTerm.length && (
          <button
            className={styles['clear_btn']}
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.value = '';
              clearQueries();
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </section>
  );
};