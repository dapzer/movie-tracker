import React, { FC } from 'react';
import FavoriteRow from '@/components/favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import styles from './favorite-page.module.scss';
import LoginModal from '@/components/core/login-modal/LoginModal';
import { useAppSelector } from '@/redux/hooks';
import { selectFavoriteList } from '@/redux/features/favoriteList/favoriteListSlice';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  const { viewed, notViewed, waitNewPart, allFavorites, watchingNow } = useAppSelector(selectFavoriteList);
  const { status } = useSession();
  const { t } = useTranslation('favoritePage');

  return (
    <div className={'container'}>
      {status === LoginStatus.Loading && <Typography variant="title2">{t('loading')}</Typography>}

      {status === LoginStatus.Unauthenticated && (
        <Typography variant="title2" className={styles['unlogin']}>
          <LoginModal btnClass={styles['unlogin_btn']} btnTitle={t('needToAuthTitle')} /> {t('needToAuthDescription')}
        </Typography>
      )}
      {!allFavorites?.length && status === LoginStatus.Authenticated && (
        <Typography variant="title2" as="h1">
          {t('emptyFavoriteList')}
        </Typography>
      )}
      {!!allFavorites?.length && (
        <Typography variant="title2" as="h1">
          {t('page_title')}
        </Typography>
      )}

      {!!watchingNow?.length && <FavoriteRow favoriteList={watchingNow} title={t('statuses.watchingNow')} />}
      {!!notViewed?.length && <FavoriteRow favoriteList={notViewed} title={t('statuses.notViewed')} />}
      {!!waitNewPart?.length && <FavoriteRow favoriteList={waitNewPart} title={t('statuses.waitNewPart')} />}
      {!!viewed?.length && <FavoriteRow favoriteList={viewed} title={t('statuses.viewed')} />}
    </div>
  );
};

export default FavoritePageContainer;
