import React, { FC } from 'react';
import styles from './ui-card.module.scss';
import Image from 'next/image';

interface Props {
  image?: string;
  children?: React.ReactNode;
  title?: string;
  date?: string;
  width?: string;
  horizontal?: boolean;
}

const UiCard: FC<Props> = ({ image, title, date, children, width, horizontal }) => {
  return (
    <div
      className={`${styles['card']} ${horizontal && styles['card__horizontal']}`}
      style={width ? { maxWidth: width } : {}}
    >
      <div className={styles['card__image']}>
        <Image
          src={image ? `https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
          width="100"
          height="150"
          objectFit="contain"
          sizes="320"
          alt="Brand logo"
        />
      </div>
      <div className={styles['card__info']}>
        <span className={styles['card__release']}>{date}</span>
        <p className={styles['card__title']}>{title}</p>
        {children}
      </div>
    </div>
  );
};

export default UiCard;
