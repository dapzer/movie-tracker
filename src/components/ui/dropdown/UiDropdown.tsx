import React, { FC } from 'react';
import styles from './ui-dropdown.module.scss';

interface Props {
  children: React.ReactNode;
  marginTop?: string;
  containerClass?: string;
}

const UiDropdown: FC<Props> = ({ children, marginTop, containerClass }) => {
  return (
    <div className={`ui-dropdown ${styles['body']} ${containerClass}`}>
      <div className={styles['content']} style={{ marginTop: marginTop }}>
        {children}
      </div>
    </div>
  );
};

export default UiDropdown;
