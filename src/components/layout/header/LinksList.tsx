import React, { FC } from 'react';
import Link from 'next/link';
import { isUrlActive } from '../../../utils/url.helper';
import styles from './header.module.scss';
import { useRouter } from 'next/router';

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

interface Props {
  modalHandler?: () => void;
}

const LinksList: FC<Props> = ({ modalHandler }) => {
  const { locale, pathname } = useRouter();

  return (
    <>
      {links[locale as keyof typeof links].map((link, index) => (
        <Link key={index} href={link.url}>
          <a className={isUrlActive(pathname, link.url) ? styles['active_page'] : ''} onClick={modalHandler}>
            {link.title}
          </a>
        </Link>
      ))}
    </>
  );
};

export default LinksList;
