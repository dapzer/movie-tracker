import React, { FC } from 'react';
import styles from './header.module.scss';
import LocaleSelect from './LocaleSelect';
import AuthBtn from './AuthBtn';
import UserProfile from './user-profile/UserProfile';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
}

const HeaderMobile: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { status } = useSession();

  return (
    <div className={styles['mobile_body']}>
      <div className={styles['controls_locale']} hidden={!isOpen}>
        <LocaleSelect />
      </div>

      <div className={styles['controls']}>
        <div hidden={isOpen}>
          <UserProfile />
        </div>

        {status === LoginStatus.Unauthenticated && !isOpen && (
          <div>
            <AuthBtn />
          </div>
        )}

        <button className={`${styles['handler']}`} onClick={setIsOpen}>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default HeaderMobile;
