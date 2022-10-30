import React, { FC, useEffect, useState } from 'react';
import styles from './search.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  setSearchTerm: (value: string) => void;
  handlePage: (arg0: number) => void;
}

const Search: FC<Props> = ({ setSearchTerm, handlePage }) => {
  const [localSearchValue, serLocalSearchValue] = useState('');
  const { t } = useTranslation('searchPage');

  // * Спустя n-секунд обновляем значение для поиска
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handlePage(1);
      setSearchTerm(localSearchValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchValue]);

  return (
    <div className={styles['search']}>
      <h3>{t('input_title')}</h3>
      <input type="text" placeholder={t('input_placeholder')} onChange={(event) => serLocalSearchValue(event.target.value)} />
    </div>
  );
};

export default Search;
