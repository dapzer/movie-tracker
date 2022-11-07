import React, { FC, useState } from 'react';
import styles from './ui-details.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
  btnClass?: string;
  isOpenedDefault?: boolean;
}

const UiDetails: FC<Props> = ({ children, title, btnClass, isOpenedDefault }) => {
  const [isOpen, setIsOpen] = useState(isOpenedDefault ? isOpenedDefault : false);

  return (
    <div>
      <button className={`${styles['ui-details__toggle-btn']} ${btnClass}`} onClick={(e) => setIsOpen(!isOpen)}>
        {title}
        <svg className={`${isOpen && styles['ui-details__arrow-active']}`}>
          <use href="/icon-arrow.svg#svg"></use>
        </svg>
      </button>
      <div className={styles['ui-details__content']} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};

export default UiDetails;
