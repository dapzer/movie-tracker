import React, { FC, useState } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import LocaleSelect from './LocaleSelect';
import HeaderMobile from './HeaderMobile';
import LinksList from './LinksList';
import AuthBtn from './AuthBtn';
import UserProfile from './user-profile/UserProfile';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';

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
    <div className={`${styles['header']} ${isOpen && styles['header-mobile__active']}`}>
      <div className={`${styles['header__content']} container`}>
        <nav className={styles['header__logo__link-list']}>
          <Link href="/">
            <h3 hidden={isOpen} className={styles['header__logo']}>
              Movie Tracker
            </h3>
          </Link>
          <LocaleSelect />
        </nav>

        <nav className={styles['header__link-list']}>
          <LinksList />
          <UserProfile />
          {status === LoginStatus.Unauthenticated && <AuthBtn />}
        </nav>

        <HeaderMobile isOpen={isOpen} setIsOpen={handleMobileMenu} />
      </div>

      {isOpen && (
        <div className={styles['header-mobile__menu']} onClick={() => handleMobileMenu()}>
          <nav onClick={(event) => event.stopPropagation()}>
            <LinksList modalHandler={handleMobileMenu} />
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
