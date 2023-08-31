import React, { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import styles from './home-page-info.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';
import Link from 'next/link';

interface Props {}

const socials = {
  ru: [
    {
      title: 'Телеграм с новостями проекта',
      link: 'https://t.me/movie_tracker_news',
    },
    {
      title: 'Телеграм для общения и обсуждения фильмов',
      link: 'https://t.me/+2lEXfqjyC2NjZWMy',
    },
  ],
  en: [
    {
      title: 'Telegram with project news',
      link: 'https://t.me/movie_tracker_news',
    },
    {
      title: 'Telegram for communication and discussion of films',
      link: 'https://t.me/+2lEXfqjyC2NjZWMy',
    },
  ],
};

export const HomePageInfo: FC<Props> = () => {
  const { t, lang } = useTranslation('searchPage');

  return (
    <section className={styles['content']}>
      <Typography as="h2" variant="title2">
        {t('page_title')}
      </Typography>
      {t('about_service')
        .split('\n\n')
        .map((el, index) => (
          <Typography key={`info-p-${index}`}>{el}</Typography>
        ))}

      <Typography as="h3" variant="title3">
        {t('socials')}
      </Typography>

      <ul className={styles['socials']}>
        {socials[lang as keyof typeof socials].map((el, index) => (
          <li key={`social-link-${index}`}>
            <Typography as={Link} variant="link" href={el.link} target="_blank" rel="noreferrer">
              {el.title}
            </Typography>
          </li>
        ))}
      </ul>
    </section>
  );
};
