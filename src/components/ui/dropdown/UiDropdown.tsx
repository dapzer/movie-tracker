import React, { FC } from 'react';
import styles from './ui-dropdown.module.scss';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  marginTop?: string;
  containerClass?: string;
}

const UiDropdown: FC<Props> = ({ children, marginTop, containerClass }) => {
  return (
    <div
      className={clsx('ui-dropdown', styles['body'], {
        [containerClass as string]: containerClass,
      })}
    >
      <div className={styles['content']} style={{ marginTop: marginTop }}>
        {children}
      </div>
    </div>
  );
};

export default UiDropdown;
