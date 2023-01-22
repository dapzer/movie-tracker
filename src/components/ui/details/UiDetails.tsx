import React, { FC, useState } from 'react';
import styles from './ui-details.module.scss';
import ArrowIcon from "public/icons/arrow.svg"

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
      <button className={`${styles['toggle_btn']} ${btnClass}`} onClick={(e) => setIsOpen(!isOpen)}>
        {title}
        <div className={`${isOpen && styles['arrow_active']}`}>
          <ArrowIcon />
        </div>
      </button>
      <div className={styles['content']} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};

export default UiDetails;
