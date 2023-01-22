import React, { FC } from 'react';
import { LoginStatus } from '@/types/Enums';
import LoginModal from '@/components/core/login-modal/LoginModal';
import { signOut, useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

interface Props {}

const AuthBtn: FC<Props> = () => {
  const { status } = useSession();
  const { t } = useTranslation('buttons');
  return (
    <>
      {status === LoginStatus.Unauthenticated ? (
        <LoginModal />
      ) : (
        <button className={'login-btn login-btn__exit'} onClick={() => signOut()}>
          {t('signOut')}
        </button>
      )}
    </>
  );
};

export default AuthBtn;
