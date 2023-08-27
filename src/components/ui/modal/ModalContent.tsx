import React, { FC, useCallback, useEffect } from 'react';
import Portal from '@/components/core/Portal';
import styles from './ui-modal.module.scss';
import { CloseIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {
  maxWidth?: number;
  fullWidth?: boolean;
  children: React.ReactNode;
  handleVisible: (arg0: boolean) => void;
  title: string;
}

const ModalContent: FC<Props> = ({ fullWidth, handleVisible, maxWidth, title, children }) => {
  const closeModalOnKeypress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', closeModalOnKeypress);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeModalOnKeypress);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Portal>
      <div className={styles['body']} onClick={() => handleVisible(false)}>
        <div className={'container'}>
          <div
            className={clsx(styles['frame'], {
              [styles['frame_fullWidth']]: fullWidth,
            })}
            style={{ maxWidth: `${maxWidth}px` }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles['header']}>
              <Typography as="h2" variant="title2">
                {title}
              </Typography>
              <button onClick={() => handleVisible(false)}>
                <CloseIcon />
              </button>
            </div>

            <div className={styles['content']}>{children}</div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ModalContent;
