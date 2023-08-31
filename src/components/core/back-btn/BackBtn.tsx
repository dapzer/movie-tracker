import React, { FC } from 'react';
import styles from './back-btn.module.scss';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

interface Props {}

export const BackBtn: FC<Props> = () => {
  const { t } = useTranslation('buttons');
  const router = useRouter();

  return (
    <button className={styles['button']} onClick={router.back}>
      {t('goBack')}
    </button>
  );
};
