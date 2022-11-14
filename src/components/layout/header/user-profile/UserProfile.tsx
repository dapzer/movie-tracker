import React, { FC } from 'react';
import styles from './user-profie.module.scss';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../../types/LoginStatus';
import Image from 'next/image';
import UiDropdown from '../../../ui/dropdown/UiDropdown';
import AuthBtn from '../AuthBtn';
import ProfileSkeleton from '../../../../lib/loading-skeleton/ProfileSkeleton';

interface Props {}

const UserProfile: FC<Props> = () => {
  const { data: session, status } = useSession();
  let profileImg = session?.user?.image;

  if (profileImg && profileImg.includes('googleusercontent')) {
    const url = new URL(profileImg);
    profileImg = `${url.protocol}//lh3-googleusercontent-com.translate.goog${url.pathname}`;
  }

  return (
    <>
      {status === LoginStatus.Loading && <ProfileSkeleton />}
      {status === LoginStatus.Authenticated && (
        <div className={`ui-dropdown__trigger ${styles['trigger']}`}>
          <div className={`${styles['content']}`}>
            <p>{session?.user?.name?.split(' ')[0]}</p>
            <div className={styles['image']}>
              <Image
                src={profileImg ? `/api/proxy/image?imageUrl=${profileImg}` : '/icon-user.svg'}
                width="32px"
                height="32px"
                objectFit="scale-down"
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
