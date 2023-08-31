import styles from './header.module.scss';
import { LocaleSelect } from './LocaleSelect';
import { AuthBtn } from './AuthBtn';
import { UserProfile } from './user-profile/UserProfile';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';

interface HeaderMobileProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const HeaderMobile = (props: HeaderMobileProps) => {
  const { isOpen, setIsOpen } = props;
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

        <button className={styles['handler']} onClick={setIsOpen}>
          <span></span>
        </button>
      </div>
    </div>
  );
};
