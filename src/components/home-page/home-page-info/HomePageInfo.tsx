import useTranslation from 'next-translate/useTranslation';
import styles from './home-page-info.module.scss';
import { Typography } from '@/components/ui/typography/UiTypography';
import Link from 'next/link';

const socials = [
  {
    title: 'telegram_with_project_news',
    link: 'https://t.me/movie_tracker_news',
  },
  {
    title: 'telegram_for_communication_and_discussion_of_films',
    link: 'https://t.me/+2lEXfqjyC2NjZWMy',
  },
];

export const HomePageInfo = () => {
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
        {socials.map((el, index) => (
          <li key={`social-link-${index}`}>
            <Typography as={Link} variant="link" href={el.link} target="_blank" rel="noreferrer">
              {t(`info.${el.title}`)}
            </Typography>
          </li>
        ))}
      </ul>
    </section>
  );
};
