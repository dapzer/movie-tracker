import React, { FC, useState } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import LocaleSelect from './LocaleSelect';
import HeaderMobile from './HeaderMobile';
import LinksList from './LinksList';
import AuthBtn from './AuthBtn';
import UserProfile from './user-profile/UserProfile';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/Enums';

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();

  const handleMobileMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <header className={`${styles['body']} ${isOpen && styles['mobile_body_active']}`}>
      <div className={`${styles['content']} container`}>
        {!isOpen && (
          <nav className={styles['logo_links']}>
            <Link href="/">
              <a>
                <h3 className={styles['logo']}>Movie Tracker</h3>
              </a>
            </Link>
            <LocaleSelect />
          </nav>
        )}

        <nav className={styles['links']}>
          <LinksList />
          <UserProfile />
          {status === LoginStatus.Unauthenticated && <AuthBtn />}
        </nav>

        <HeaderMobile isOpen={isOpen} setIsOpen={handleMobileMenu} />
      </div>

      {isOpen && (
        <div className={styles['menu']} onClick={() => handleMobileMenu()}>
          <nav onClick={(event) => event.stopPropagation()} className={styles['links']}>
            <LinksList modalHandler={handleMobileMenu} />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
