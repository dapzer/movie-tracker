import React, { FC } from 'react';
import styles from './back-btn.module.scss';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
interface Props {}

const BackBtn: FC<Props> = () => {
  const { t } = useTranslation('buttons');
  const router = useRouter();
  return (
    <button className={styles['back-btn']} onClick={router.back}>
      {t('goBack')}
    </button>
  );
};

export default BackBtn;
