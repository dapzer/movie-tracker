import styles from './ui-dropdown.module.scss';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  marginTop?: string;
  containerClass?: string;
}

export const UiDropdown = (props: Props) => {
  const { children, marginTop, containerClass } = props;

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
