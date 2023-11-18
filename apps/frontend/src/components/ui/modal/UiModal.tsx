import { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ModalContent } from './ModalContent';
import styles from './ui-modal.module.scss';
import clsx from 'clsx';

interface UiModalProps {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
  btnTitle?: string | ReactElement;
  maxWidth?: number;
  btnClass?: string;
  isOpenedDefault?: boolean;
  customHandler?: (arg0: boolean) => void;
}

export const UiModal = (props: UiModalProps) => {
  const { title, children, fullWidth, btnTitle, maxWidth, btnClass, isOpenedDefault, customHandler } = props;
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
        <button
          hidden={isOpenedDefault}
          className={clsx(styles['open-btn'], {
            [styles['open-btn__default']]: !btnClass,
            [btnClass as string]: btnClass,
          })}
          onClick={() => handleVisible(true)}
        >
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
