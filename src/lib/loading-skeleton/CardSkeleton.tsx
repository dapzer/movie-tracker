import React, { FC } from 'react';
import styles from '../../components/ui/card/ui-card.module.scss';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

interface Props {
  width?: string;
  height?: number;
  horizontal?: boolean;
  children?: React.ReactNode;
}

const CardSkeleton: FC<Props> = ({ horizontal, width, children, height }) => {
  return (
    <div className={`${styles['card']} ${horizontal && styles['card__horizontal']}`} style={width ? { maxWidth: width } : {}}>
      <div className={styles['card__image']}>
        <Skeleton height={height ? height : 390} />
      </div>
      <div className={styles['card__info']}>
        <span className={styles['card__release']}>
          <Skeleton style={{ maxWidth: '100px' }} height={'1em'} />
        </span>
        <p className={styles['card__title']}>
          <Skeleton style={{ maxWidth: '150px' }} />
        </p>
        {children}
      </div>
    </div>
  );
};

export default CardSkeleton;
