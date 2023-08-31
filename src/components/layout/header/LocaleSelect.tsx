import React, { FC } from 'react';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {}

export const LocaleSelect: FC<Props> = () => {
  const router = useRouter();
  return (
    <div className={styles['locale-select']}>
      <Typography
        as={Link}
        variant="link"
        href={router.asPath}
        locale={'ru'}
        className={clsx({
          [styles['active']]: router.locale === 'ru',
        })}
      >
        Ru
      </Typography>
      <div></div>
      <Typography
        as={Link}
        variant="link"
        href={router.asPath}
        locale={'en'}
        className={clsx({
          [styles['active']]: router.locale === 'en',
        })}
      >
        En
      </Typography>
    </div>
  );
};
