import React, { FC } from 'react';
import Link from 'next/link';
import { isUrlActive } from '@/utils/isUrlActive';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const links = [
  {
    title: 'homePage',
    url: '/',
  },
  {
    title: 'favoritePage',
    url: '/favorite',
  },
];

interface Props {
  modalHandler?: () => void;
}

const LinksList: FC<Props> = ({ modalHandler }) => {
  const { pathname } = useRouter();
  const { t } = useTranslation('links');

  return (
    <>
      {links.map((link, index) => (
        <Link key={index} href={link.url} className={isUrlActive(pathname, link.url) ? styles['active_page'] : ''}
              onClick={modalHandler}>
          {t(link.title)}
        </Link>
      ))}
    </>
  );
};

export default LinksList;
