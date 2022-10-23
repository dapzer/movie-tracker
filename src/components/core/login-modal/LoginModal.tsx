import React, { FC } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';
import UiModal from '../../ui/modal/UiModal';
import styles from './login-modal.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {}

const LoginModal: FC<Props> = () => {
  const { status } = useSession();
  const { t } = useTranslation('buttons');

  return (
    <>
      {status === LoginStatus.Unauthenticated && (
        <UiModal title={t('signIn')} maxWidth={350} btnClass={'login-btn'} btnTitle={t('signIn')}>
          <div className={styles['login-modal']}>
            <button onClick={() => signIn('google')} style={{ '--bg': '#f2573f' } as React.CSSProperties}>
              Google
            </button>
            <button onClick={() => signIn('github')} style={{ '--bg': '#444' } as React.CSSProperties}>
              GitHub
            </button>
            <button onClick={() => signIn('vk')} style={{ '--bg': '#0077FF' } as React.CSSProperties}>
              Vkontakte
            </button>
          </div>
        </UiModal>
      )}
    </>
  );
};

export default LoginModal;
