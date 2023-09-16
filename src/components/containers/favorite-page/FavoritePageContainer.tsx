import { useEffect, useState } from 'react';
import { FavoriteRow } from '@/components/favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus, StatusesNames } from '@/types/Enums';
import styles from './favorite-page.module.scss';
import { LoginModal } from '@/components/core/login-modal/LoginModal';
import { useAppSelector } from '@/redux/hooks';
import { selectFavoriteList } from '@/redux/features/favoriteList/favoriteListSlice';
import { Typography } from '@/components/ui/typography/UiTypography';
import { FavoriteListCategoriesOpenStatus } from '@/types/FavoriteListCategoriesOpenStatus';

export const FavoritePageContainer = () => {
  const { viewed, notViewed, waitNewPart, allFavorites, watchingNow, isGettingFavoriteList } = useAppSelector(selectFavoriteList);
  const { status } = useSession();
  const { t } = useTranslation('favoritePage');
  const [currentCategoriesOpenStatus, setCurrentCategoriesOpenStatus] = useState<FavoriteListCategoriesOpenStatus>({
    viewed: true,
    notViewed: true,
    waitNewPart: true,
    watchingNow: true,
  });

  useEffect(() => {
    const localStorageData = localStorage.getItem('favoriteListCategoriesOpenStatus');

    if (localStorageData) {
      setCurrentCategoriesOpenStatus(JSON.parse(localStorageData));
    }
  }, []);

  const handleCategoryOpenStatus = (category: keyof FavoriteListCategoriesOpenStatus) => {
    const newObj = {
      ...currentCategoriesOpenStatus,
      [category]: !currentCategoriesOpenStatus[category],
    };

    setCurrentCategoriesOpenStatus(newObj);
    localStorage.setItem('favoriteListCategoriesOpenStatus', JSON.stringify(newObj));
  };

  return (
    <div className={'container'}>
      {(status === LoginStatus.Loading || isGettingFavoriteList) && <Typography variant="title2">{t('loading')}</Typography>}

      {status === LoginStatus.Unauthenticated && !isGettingFavoriteList && (
        <Typography variant="title2" className={styles['unlogin']}>
          <LoginModal btnClass={styles['unlogin_btn']} btnTitle={t('needToAuthTitle')} /> {t('needToAuthDescription')}
        </Typography>
      )}
      {!allFavorites?.length && status === LoginStatus.Authenticated && !isGettingFavoriteList && (
        <Typography variant="title2" as="h1">
          {t('emptyFavoriteList')}
        </Typography>
      )}

      {!!allFavorites?.length && (
        <Typography variant="title2" as="h1">
          {t('page_title')}
        </Typography>
      )}

      {!!watchingNow?.length && (
        <FavoriteRow
          isOpenedDefault={currentCategoriesOpenStatus.watchingNow}
          additionalOpenHandler={() => handleCategoryOpenStatus(StatusesNames.watchingNow)}
          favoriteList={watchingNow}
          title={t('statuses.watchingNow')}
        />
      )}
      {!!notViewed?.length && (
        <FavoriteRow
          isOpenedDefault={currentCategoriesOpenStatus.notViewed}
          additionalOpenHandler={() => handleCategoryOpenStatus(StatusesNames.notViewed)}
          favoriteList={notViewed}
          title={t('statuses.notViewed')}
        />
      )}
      {!!waitNewPart?.length && (
        <FavoriteRow
          isOpenedDefault={currentCategoriesOpenStatus.waitNewPart}
          additionalOpenHandler={() => handleCategoryOpenStatus(StatusesNames.waitNewPart)}
          favoriteList={waitNewPart}
          title={t('statuses.waitNewPart')}
        />
      )}
      {!!viewed?.length && (
        <FavoriteRow
          isOpenedDefault={currentCategoriesOpenStatus.viewed}
          additionalOpenHandler={() => handleCategoryOpenStatus(StatusesNames.viewed)}
          favoriteList={viewed}
          title={t('statuses.viewed')}
        />
      )}
    </div>
  );
};
