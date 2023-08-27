import React, { FC } from 'react';
import styles from './user-profie.module.scss';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import Image from 'next/image';
import UiDropdown from '@/components/ui/dropdown/UiDropdown';
import AuthBtn from '@/components/layout/header/AuthBtn';
import ProfileSkeleton from '@/lib/loading-skeleton/ProfileSkeleton';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {}

const UserProfile: FC<Props> = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === LoginStatus.Loading && <ProfileSkeleton />}
      {status === LoginStatus.Authenticated && (
        <div className={clsx(styles['trigger'], 'ui-dropdown__trigger')}>
          <div className={styles['content']}>
            <Typography>{session?.user?.name?.split(' ')[0]}</Typography>
            <div className={styles['image']}>
              <Image
                src={session?.user?.image ? `/api/proxy/image?imageUrl=${session?.user?.image}` : '/icons/user.svg'}
                width={32}
                height={32}
                sizes="33wv"
                alt="Img"
              />
            </div>
          </div>
          <UiDropdown marginTop={'20px'} containerClass={styles['dropdown_body']}>
            <div className={styles['dropdown']}>
              <div>
                <Typography>{session?.user?.name}</Typography>
                {session?.user?.email && <Typography>{session?.user?.email}</Typography>}
              </div>
              <AuthBtn />
            </div>
          </UiDropdown>
        </div>
      )}
    </>
  );
};

export default UserProfile;
