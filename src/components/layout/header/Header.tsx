import React, { FC } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isUrlActive } from '../../../utils/url.helper';

const links = [
  {
    title: 'Поиск',
    url: '/',
  },
  {
    title: 'Избранное',
    url: '/favorite',
  },
];

const Header: FC = () => {
  const router = useRouter();

  return (
    <div className={styles['header']}>
      <div className={`${styles['header__content']} container`}>
        <Link href="/">
          <h3 className={styles['header__logo']}>Movie Tracker</h3>
        </Link>

        <nav className={styles['header__link-list']}>
          {links.map((link, index) => (
            <Link key={index} href={link.url}>
              <a
                className={
                  isUrlActive(router.asPath, link.url)
                    ? styles['header__link-list__active-page']
                    : ''
                }
              >
                {link.title}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;
