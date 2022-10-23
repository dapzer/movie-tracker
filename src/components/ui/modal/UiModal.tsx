import React, { FC, useCallback, useEffect, useState } from 'react';
import styles from './ui-modal.module.scss';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  btnTitle?: string;
  maxWidth?: number;
  btnClass?: string;
  isOpenedDefault?: boolean;
}

const UiModal: FC<Props> = ({ title, children, fullWidth, btnTitle, maxWidth, btnClass, isOpenedDefault }) => {
  const [modalVisible, setModalVisible] = useState(isOpenedDefault);
  const { t } = useTranslation('buttons');

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
      <button hidden={isOpenedDefault} className={`modal-open-btn ${btnClass && btnClass}`} onClick={() => handleVisible(true)}>
        {btnTitle ? btnTitle : t('more')}
      </button>

      {modalVisible && (
        <div className={styles['modal']} onClick={() => handleVisible(false)}>
          <div className={`container`}>
            <div
              className={`${fullWidth && styles['modal__full-width']} ${styles['modal__body']}`}
              style={{ maxWidth: `${maxWidth}px` }}
              onClick={(event) => event.stopPropagation()}
            >
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
