import React, { FC, useCallback, useEffect, useState } from 'react';
import styles from './ui-modal.module.scss';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Portal from '../../core/Portal';
import ModalContent from './ModalContent';

interface Props {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  btnTitle?: string;
  maxWidth?: number;
  btnClass?: string;
  isOpenedDefault?: boolean;
  customHandler?: (arg0: boolean) => void;
}

const UiModal: FC<Props> = ({ title, children, fullWidth, btnTitle, maxWidth, btnClass, isOpenedDefault, customHandler }) => {
  const [modalVisible, setModalVisible] = useState(isOpenedDefault);
  const { t } = useTranslation('buttons');

  const handleVisible = useCallback((value: boolean) => {
    setModalVisible(value);
    customHandler && customHandler(value);
  }, []);

  useEffect(() => {
    if (!isOpenedDefault) return;
    handleVisible(isOpenedDefault);
  }, [isOpenedDefault]);

  return (
    <>
      {!isOpenedDefault && (
        <button hidden={isOpenedDefault} className={`modal-open-btn ${btnClass && btnClass}`} onClick={() => handleVisible(true)}>
          {btnTitle ? btnTitle : t('more')}
        </button>
      )}

      {modalVisible && (
        <ModalContent handleVisible={handleVisible} title={title} maxWidth={maxWidth} fullWidth={fullWidth}>
          {children}
        </ModalContent>
      )}
    </>
  );
};

export default UiModal;
