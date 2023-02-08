import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import CardSkeleton from './CardSkeleton';

interface Props {}

const DetailsCastSkeleton: FC<Props> = () => {
  return (
    <section>
      <h2>
        <Skeleton style={{ maxWidth: '250px' }} />
      </h2>

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
