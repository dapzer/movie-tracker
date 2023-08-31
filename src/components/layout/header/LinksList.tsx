import Link from 'next/link';
import { isUrlActive } from '@/utils/isUrlActive';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

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

interface LinksListProps {
  modalHandler?: () => void;
}

export const LinksList = (props: LinksListProps) => {
  const { modalHandler } = props;
  const { pathname } = useRouter();
  const { t } = useTranslation('links');

  return (
    <>
      {links.map((link, index) => (
        <Typography
          as={Link}
          variant="link"
          key={index}
          href={link.url}
          className={clsx({
            [styles['active_page']]: isUrlActive(pathname, link.url),
          })}
          onClick={modalHandler}
        >
          {t(link.title)}
        </Typography>
      ))}
    </>
  );
};
