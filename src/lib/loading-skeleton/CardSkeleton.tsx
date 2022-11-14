import React, { FC } from 'react';
import styles from '../../components/ui/card/ui-card.module.scss';
import Skeleton from 'react-loading-skeleton';

interface Props {
  width?: string;
  height?: number;
  horizontal?: boolean;
  children?: React.ReactNode;
  small?: boolean;
}

const CardSkeleton: FC<Props> = ({ horizontal, width, children, height, small }) => {
  return (
    <div className={`${styles['body']} ${horizontal && styles['horizontal']} ${small && styles['small']}`} style={width ? { maxWidth: width } : {}}>
      <div className={styles['image']}>
        <Skeleton height={height ? height : 390} />
      </div>
      <div className={styles['info']}>
        <span className={styles['release']}>
          <Skeleton style={{ maxWidth: '100px' }} height={'1em'} />
        </span>
        <p className={styles['title']}>
          <Skeleton style={{ maxWidth: '150px' }} />
        </p>
        {children}
      </div>
    </div>
  );
};

export default CardSkeleton;
