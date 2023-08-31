import React, { FC } from 'react';
import styles from '@/components/ui/card/ui-card.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {
  width?: string;
  height?: number;
  horizontal?: boolean;
  children?: React.ReactNode;
  small?: boolean;
}

export const CardSkeleton: FC<Props> = ({ horizontal, width, children, height, small }) => {
  return (
    <div
      className={clsx(styles['body'], {
        [styles['horizontal']]: horizontal,
        [styles['small']]: small,
      })}
      style={width ? { maxWidth: width } : {}}
    >
      <div className={styles['image']}>
        <Skeleton height={height ? height : 390} />
      </div>
      <div className={styles['info']}>
        <Typography as="span" variant="textSmall" className={styles['release']}>
          <Skeleton style={{ maxWidth: '100px' }} height={'1em'} />
        </Typography>
        <Typography className={styles['title']}>
          <Skeleton style={{ maxWidth: '150px' }} />
        </Typography>
        {children}
      </div>
    </div>
  );
};
