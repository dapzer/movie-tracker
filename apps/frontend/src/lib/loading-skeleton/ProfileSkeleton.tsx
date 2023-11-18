import styles from '@/components/layout/header/user-profile/user-profie.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

export const ProfileSkeleton = () => {
  return (
    <div className={styles['content']}>
      <Typography>
        <Skeleton baseColor="#4F5D75" highlightColor="#282f43" width={75} />
      </Typography>
      <div className={styles['image']}>
        <Skeleton baseColor="#4F5D75" highlightColor="#282f43" circle width={32} height={32} />
      </div>
    </div>
  );
};
