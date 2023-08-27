import React, { FC, useState } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import LocaleSelect from './LocaleSelect';
import HeaderMobile from './HeaderMobile';
import LinksList from './LinksList';
import AuthBtn from './AuthBtn';
import UserProfile from './user-profile/UserProfile';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

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
    <header
      className={clsx(styles['body'], {
        [styles['mobile_body_active']]: isOpen,
      })}
    >
      <div className={clsx(styles['content'], 'container')}>
        {!isOpen && (
          <nav className={styles['logo_links']}>
            <Typography as={Link} variant="title3" className={styles['logo']} href="/">
              Movie Tracker
            </Typography>
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
