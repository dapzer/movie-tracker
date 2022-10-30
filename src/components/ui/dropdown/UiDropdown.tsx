import React, { FC, useState } from 'react';
import styles from './ui-dropdown.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
  btnClass?: string;
  isOpenedDefault?: boolean;
}

const UiDropdown: FC<Props> = ({ children, title, btnClass, isOpenedDefault }) => {
  const [isOpen, setIsOpen] = useState(isOpenedDefault ? isOpenedDefault : false);

  return (
    <div>
      <button className={`${styles['ui-dropdown__toggle-btn']} ${btnClass}`} onClick={(e) => setIsOpen(!isOpen)}>
        {title}
        <svg className={`${isOpen && styles['ui-dropdown__arrow-active']}`}>
          <use href="/icon-arrow.svg#svg"></use>
        </svg>
      </button>
      <div className={styles['ui-dropdown__content']} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};

export default UiDropdown;
