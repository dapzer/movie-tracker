import React, { FC } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';
import UiModal from '../../ui/modal/UiModal';
import styles from './login-modal.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  isOpenedDefault: boolean;
  customHandler?: (arg0: boolean) => void;
}

const LoginModal: FC<Props> = ({ isOpenedDefault, customHandler }) => {
  const { t } = useTranslation('buttons');

  return (
    <UiModal
      customHandler={customHandler}
      title={t('signIn')}
      maxWidth={350}
      isOpenedDefault={isOpenedDefault}
      btnClass={'login-btn'}
      btnTitle={t('signIn')}
    >
      <div className={styles['login-modal']}>
        <button onClick={() => signIn('google')} style={{ '--bg': '#D92929' } as React.CSSProperties}>
          Google
        </button>
        <button onClick={() => signIn('yandex')} style={{ '--bg': '#FFCC00' } as React.CSSProperties}>
          Yandex
        </button>
        <button onClick={() => signIn('vk')} style={{ '--bg': '#0077FF' } as React.CSSProperties}>
          Vkontakte
        </button>
        <button onClick={() => signIn('github')} style={{ '--bg': '#444' } as React.CSSProperties}>
          GitHub
        </button>
      </div>
    </UiModal>
  );
};

export default LoginModal;
