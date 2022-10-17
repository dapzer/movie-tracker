import React, { FC, useState } from 'react';
import styles from './ui-dropdown.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
}

const UiDropdown: FC<Props> = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles['ui-dropdown']} ${isOpen ? styles['ui-dropdown__open'] : ''}`}>
      <button className={styles['ui-dropdown__toggle-btn']} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <svg>
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
