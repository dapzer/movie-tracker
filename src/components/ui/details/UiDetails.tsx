import React, { FC, useState } from 'react';
import styles from './ui-details.module.scss';
import { ArrowIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';

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
          <Typography className={styles['title']}>{title}</Typography>
          {description && <Typography className={styles['description']}>{description}</Typography>}
        </div>
        <div className={`${styles['arrow']} ${isOpen ? styles['arrow_active'] : ''}`}>
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
