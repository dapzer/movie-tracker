import React, { FC } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {}

const LocaleSelect: FC<Props> = () => {
  const router = useRouter();
  return (
    <div className={styles['locale-select']}>
      <Typography as={Link} variant="link" href={router.asPath} locale={'ru'} className={`${router.locale === 'ru' && styles['active']}`}>
        Ru
      </Typography>
      <div></div>
      <Typography as={Link} variant="link" href={router.asPath} locale={'en'} className={`${router.locale === 'en' && styles['active']}`}>
        En
      </Typography>
    </div>
  );
};

export default LocaleSelect;
