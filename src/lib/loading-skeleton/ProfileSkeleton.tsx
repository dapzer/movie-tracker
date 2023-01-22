import React, { FC } from 'react';
import styles from '@/components/layout/header/user-profile/user-profie.module.scss';
import Skeleton from 'react-loading-skeleton';

interface Props {}

const ProfileSkeleton: FC<Props> = () => {
  return (
    <div className={styles['content']}>
      <p>
        <Skeleton baseColor="#4F5D75" highlightColor="#282f43" width={75} />
      </p>
      <div className={styles['image']}>
        <Skeleton baseColor="#4F5D75" highlightColor="#282f43" circle width={32} height={32} />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
