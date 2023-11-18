import { signIn } from 'next-auth/react';
import { UiModal } from '@/components/ui/modal/UiModal';
import styles from './login-modal.module.scss';
import useTranslation from 'next-translate/useTranslation';

const loginOptions = [
  {
    title: 'Google',
    provider: 'google',
    color: '#D92929',
  },
  {
    title: 'Yandex',
    provider: 'yandex',
    color: '#FFCC00',
  },
  {
    title: 'Vkontakte',
    provider: 'vk',
    color: '#0077FF',
  },
  {
    title: 'GitHub',
    provider: 'github',
    color: '#444',
  },
];

interface LoginModalProps {
  isOpenedDefault?: boolean;
  customHandler?: (arg0: boolean) => void;
  btnTitle?: string;
  btnClass?: string;
}

export const LoginModal = (props: LoginModalProps) => {
  const { isOpenedDefault, customHandler, btnTitle, btnClass } = props;
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
        {loginOptions.map((option) => (
          <button key={option.title} onClick={() => signIn(option.provider)} style={{ '--bg': option.color } as React.CSSProperties}>
            {option.title}
          </button>
        ))}
      </div>
    </UiModal>
  );
};
