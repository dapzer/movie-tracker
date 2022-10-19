import React, { FC, useCallback, useEffect } from 'react';
import styles from './ui-modal.module.scss';
import Image from 'next/image';

interface Props {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  visible: boolean;
  handleVisible: (state: boolean) => void;
}

const UiModal: FC<Props> = ({ title, children, fullWidth, visible, handleVisible }) => {
  const closeModal = useCallback(() => {
    handleVisible(false);
  }, []);

  const closeModalOnKeypress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', closeModalOnKeypress);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', closeModalOnKeypress);
      document.body.style.overflow = 'auto';
    }
  }, [visible]);

  return (
    <div hidden={!visible} className={styles['modal']} onClick={() => closeModal()}>
      <div className={`container`} onClick={(event) => event.stopPropagation()}>
        <div className={`${fullWidth && styles['modal__full-width']} ${styles['modal__body']}`}>
          <div className={styles['modal__header']}>
            <h2>{title}</h2>
            <button onClick={() => closeModal()}>
              <Image src="/icon-close.svg" width={25} height={25} />
            </button>
          </div>

          <div className={styles['modal__content']}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UiModal;
