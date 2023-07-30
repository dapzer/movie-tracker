import React, { FC, useState } from 'react';
import styles from './ui-details.module.scss';
import { ArrowIcon } from '@/components/ui/Icons';

interface Props {
  children: React.ReactNode;
  description?: string;
  title: string;
  isOpenedDefault?: boolean;
  isLarge?: boolean;
}

const UiDetails: FC<Props> = ({ children, title, isOpenedDefault, description, isLarge }) => {
  const [isOpen, setIsOpen] = useState(isOpenedDefault ? isOpenedDefault : false);

  return (
    <div>
      <button className={`${styles['toggle_btn']} ${isLarge ? styles['large'] : ''}`} onClick={(e) => setIsOpen(!isOpen)}>
        <div className={styles['info']}>
          <p className={styles['title']}>{title}</p>
          <p className={styles['description']}>{description}</p>
        </div>
        <div className={`${styles['arrow']} ${isOpen && styles['arrow_active']}`}>
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
