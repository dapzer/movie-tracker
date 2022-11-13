import React, { FC } from 'react';
import { signIn } from 'next-auth/react';
import UiModal from '../../ui/modal/UiModal';
import styles from './login-modal.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  isOpenedDefault?: boolean;
  customHandler?: (arg0: boolean) => void;
  btnTitle?: string;
  btnClass?: string;
}

const LoginModal: FC<Props> = ({ isOpenedDefault, customHandler, btnTitle, btnClass }) => {
  const { t } = useTranslation('buttons');

  return (
    <UiModal
      customHandler={customHandler}
      title={t('signIn')}
      maxWidth={350}
      isOpenedDefault={isOpenedDefault}
      btnClass={btnClass || 'login-btn'}
      btnTitle={btnTitle || t('signIn')}
    >
      <div className={styles['content']}>
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
