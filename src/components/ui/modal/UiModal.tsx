import React, { FC, useCallback, useEffect, useState } from 'react';
import styles from './ui-modal.module.scss';
import Image from 'next/image';

interface Props {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  btnTitle?: string;
}

const UiModal: FC<Props> = ({ title, children, fullWidth, btnTitle }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModalOnKeypress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleVisible(false);
    }
  }, []);

  const handleVisible = useCallback((value: boolean) => {
    setModalVisible(value);

    if (value) {
      document.addEventListener('keydown', closeModalOnKeypress);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', closeModalOnKeypress);
      document.body.style.overflow = 'auto';
    }
  }, []);

  return (
    <>
      <button className={'modal-open-btn'} onClick={() => handleVisible(true)}>
        {btnTitle ? btnTitle : 'Подробнее'}
      </button>

      {modalVisible && (
        <div className={styles['modal']} onClick={() => handleVisible(false)}>
          <div className={`container`} onClick={(event) => event.stopPropagation()}>
            <div className={`${fullWidth && styles['modal__full-width']} ${styles['modal__body']}`}>
              <div className={styles['modal__header']}>
                <h2>{title}</h2>
                <button onClick={() => handleVisible(false)}>
                  <Image src="/icon-close.svg" width={25} height={25} />
                </button>
              </div>

              <div className={styles['modal__content']}>{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UiModal;
