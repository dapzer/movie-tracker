import React, { FC } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isUrlActive } from '../../../utils/url.helper';
import LocaleSelect from './LocaleSelect';
import LoginModal from '../../core/login-modal/LoginModal';
import { signOut, useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';
import useTranslation from 'next-translate/useTranslation';

const links = {
  ru: [
    {
      title: 'Поиск',
      url: '/',
    },
    {
      title: 'Избранное',
      url: '/favorite',
    },
  ],
  en: [
    {
      title: 'Search',
      url: '/',
    },
    {
      title: 'Favorite',
      url: '/favorite',
    },
  ],
};

const Header: FC = () => {
  const { asPath, locale } = useRouter();
  const { status } = useSession();
  const { t } = useTranslation('buttons');

  return (
    <div className={styles['header']}>
      <div className={`${styles['header__content']} container`}>
        <Link href="/">
          <h3 className={styles['header__logo']}>Movie Tracker</h3>
        </Link>

        <nav className={styles['header__link-list']}>
          {links[locale as keyof typeof links].map((link, index) => (
            <Link key={index} href={link.url}>
              <a className={isUrlActive(asPath, link.url) ? styles['header__link-list__active-page'] : ''}>{link.title}</a>
            </Link>
          ))}

          <LocaleSelect />

          {status === LoginStatus.Unauthenticated ? (
            <LoginModal />
          ) : (
            <button className={'login-btn login-btn__exit'} onClick={() => signOut()}>
              {t('signOut')}
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;
