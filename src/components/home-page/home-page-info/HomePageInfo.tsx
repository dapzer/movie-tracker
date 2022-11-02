import React, { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import styles from './home-page-info.module.scss';

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

const HomePageInfo: FC<Props> = () => {
  const { t, lang } = useTranslation('searchPage');

  return (
    <div className={styles['home-page-info']}>
      <h2>{t('page_title')}</h2>
      {t('about_service')
        .split('\n\n')
        .map((el, index) => (
          <p key={`info-p-${index}`}>{el}</p>
        ))}

      <h3>{t('socials')}</h3>

      <ul className={styles['home-page-info__socials']}>
        {socials[lang as keyof typeof socials].map((el, index) => (
          <li key={`social-link-${index}`}>
            <a href={el.link} target="_blank">
              {el.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePageInfo;
