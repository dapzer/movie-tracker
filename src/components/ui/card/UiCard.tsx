import styles from './ui-card.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  image?: string;
  children?: ReactNode;
  title?: string;
  date?: string;
  width?: string;
  horizontal?: boolean;
  link?: string;
  small?: boolean;
}

export const UiCard = (props: Props) => {
  const { image, title, date, children, width, horizontal, link, small } = props;

  return (
    <div
      className={clsx(styles['body'], {
        [styles['horizontal']]: horizontal,
        [styles['small']]: small,
      })}
      style={width ? { maxWidth: width } : {}}
    >
      <div className={styles['image']}>
        <Link href={{ pathname: link || '', slashes: null }}>
          <Image
            src={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            onError={(event) => event.currentTarget.src = '/defaultPoster.svg'}
            loading={"lazy"}
            width={260}
            height={390}
            sizes="33wv"
            alt="Image"
          />
        </Link>
      </div>
      <div className={styles['info']}>
        <Typography as="span" variant="textSmall" className={styles['release']}>
          {date}
        </Typography>
        <Typography className={styles['title']}>{title}</Typography>
        {children}
      </div>
    </div>
  );
};
