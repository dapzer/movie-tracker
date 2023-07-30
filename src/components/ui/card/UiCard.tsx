import React, { FC } from 'react';
import styles from './ui-card.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  image?: string;
  children?: React.ReactNode;
  title?: string;
  date?: string;
  width?: string;
  horizontal?: boolean;
  link?: string;
  small?: boolean;
}

const UiCard: FC<Props> = ({ image, title, date, children, width, horizontal, link, small }) => {
  return (
    <div className={`${styles['body']} ${horizontal && styles['horizontal']} ${small && styles['small']}`} style={width ? { maxWidth: width } : {}}>
      <div className={styles['image']}>
        <Link href={{ pathname: link || '', slashes: null }}>
          <Image
            src={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            width={260}
            height={390}
            sizes="33wv"
            alt="Image"
          />
        </Link>
      </div>
      <div className={styles['info']}>
        <span className={styles['release']}>{date}</span>
        <p className={styles['title']}>{title}</p>
        {children}
      </div>
    </div>
  );
};

export default UiCard;
