import React, { FC } from 'react';
import styles from './footer.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';
import Link from 'next/link';

interface Props {}

const contacts = [
  {
    title: 'GitHub:',
    value: 'dapzer',
    link: 'https://github.com/dapzer',
  },
  {
    title: 'Telegram:',
    value: '@dapzer',
    link: 'https://t.me/dapzer',
  },
  {
    title: 'Email:',
    value: 'danila.webdev@gmail.com',
    link: 'mailto:danila.webdev@gmail.com',
  },
];

const Footer: FC<Props> = () => {
  return (
    <footer className={styles['body']}>
      <div className={'container'}>
        <ul>
          <li>
            Created by:{' '}
            <Typography variant="listItem" as="span">
              Danila Voronkov
            </Typography>
          </li>
          {contacts.map((el, index) => (
            <li key={`footer-link-${index}`}>
              {el.title}{' '}
              <Typography as={Link} variant="link" href={el.link} target="_blank" rel="noreferrer">
                {el.value}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
