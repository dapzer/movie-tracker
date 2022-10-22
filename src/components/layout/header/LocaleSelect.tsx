import React, { FC } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props {}

const LocaleSelect: FC<Props> = () => {
  const router = useRouter();
  return (
    <div className={styles['locale-select']}>
      <Link href={router.asPath} locale={'ru'}>
        <a className={`${router.locale === 'ru' && styles['locale-select__active']}`}>Ru</a>
      </Link>
      <div></div>
      <Link href={router.asPath} locale={'en'}>
        <a className={`${router.locale === 'en' && styles['locale-select__active']}`}>En</a>
      </Link>
    </div>
  );
};

export default LocaleSelect;
