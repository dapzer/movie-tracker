import React, { FC } from 'react';
import styles from './user-profie.module.scss';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import Image from 'next/image';
import UiDropdown from '@/components/ui/dropdown/UiDropdown';
import AuthBtn from '@/components/layout/header/AuthBtn';
import ProfileSkeleton from '@/lib/loading-skeleton/ProfileSkeleton';

interface Props {}

const UserProfile: FC<Props> = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === LoginStatus.Loading && <ProfileSkeleton />}
      {status === LoginStatus.Authenticated && (
        <div className={`ui-dropdown__trigger ${styles['trigger']}`}>
          <div className={`${styles['content']}`}>
            <p>{session?.user?.name?.split(' ')[0]}</p>
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
                <p>{session?.user?.name}</p>
                {session?.user?.email && <p>{session?.user?.email}</p>}
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
