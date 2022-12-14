import React, { FC, useCallback, useEffect } from 'react';
import Portal from '../../core/Portal';
import styles from './ui-modal.module.scss';
import Image from 'next/image';

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
        <div className={`container`}>
          <div
            className={`${fullWidth && styles['frame_fullWidth']} ${styles['frame']}`}
            style={{ maxWidth: `${maxWidth}px` }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles['header']}>
              <h2>{title}</h2>
              <button onClick={() => handleVisible(false)}>
                <svg width={25} height={25}>
                  <use href="/icon-close.svg#svg"></use>
                </svg>
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
