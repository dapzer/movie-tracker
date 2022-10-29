import React, { FC, useState } from 'react';
import styles from './header.module.scss';
import LocaleSelect from './LocaleSelect';
import { LoginStatus } from '../../../types/LoginStatus';
import LoginModal from '../../core/login-modal/LoginModal';
import { signOut, useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import LinksList from './LinksList';
import AuthBtn from './AuthBtn';

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
}

const HeaderMobile: FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <div className={styles['header-mobile']}>
      <div className={styles['header-mobile__controls__lang']} hidden={!isOpen}>
        <LocaleSelect />
      </div>
      <div className={styles['header-mobile__controls']}>
        <div hidden={!isOpen}>
          <AuthBtn />
        </div>

        <button className={`${styles['header-mobile__controls__handler']}`} onClick={setIsOpen}>
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default HeaderMobile;
