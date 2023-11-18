import styles from './back-btn.module.scss';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

export const BackBtn = () => {
  const { t } = useTranslation('buttons');
  const router = useRouter();

  return (
    <button className={styles['button']} onClick={router.back}>
      {t('goBack')}
    </button>
  );
};
