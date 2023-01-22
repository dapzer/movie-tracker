import React, { FC } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props {
}

const LocaleSelect: FC<Props> = () => {
  const router = useRouter();
  return (
    <div className={styles['locale-select']}>
      <Link href={router.asPath} locale={'ru'} className={`${router.locale === 'ru' && styles['active']}`}>
        Ru
      </Link>
      <div></div>
      <Link href={router.asPath} locale={'en'} className={`${router.locale === 'en' && styles['active']}`}>
        En
      </Link>
    </div>
  );
};

export default LocaleSelect;
