import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import CardSkeleton from './CardSkeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {}

const DetailsCastSkeleton: FC<Props> = () => {
  return (
    <section>
      <Typography as="h2" variant="title2">
        <Skeleton style={{ maxWidth: '250px' }} />
      </Typography>

      <div className={'details-grid'}>
        {Array(6)
          .fill('_')
          .map((el, index) => (
            <CardSkeleton key={index} horizontal height={225}>
              <ul>
                <li>
                  <Skeleton style={{ maxWidth: '100px' }} />
                  <Skeleton style={{ maxWidth: '50px' }} />
                </li>
              </ul>
              <Skeleton style={{ maxWidth: '100px' }} />
            </CardSkeleton>
          ))}
      </div>
    </section>
  );
};

export default DetailsCastSkeleton;
