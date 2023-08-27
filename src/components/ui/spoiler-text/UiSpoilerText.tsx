import styles from './ui-spoiler-text.module.scss';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';

interface UiSpoilerTextProps {
  children: ReactNode;
}

export const UiSpoilerText = (props: UiSpoilerTextProps) => {
  const [isShowText, setIsShowText] = useState<boolean>(false);

  const toggleShowText = () => {
    setIsShowText((prev) => !prev);
  };

  return (
    <div
      className={clsx(styles['wrapper'], {
        [styles['active']]: !isShowText,
      })}
      onClick={toggleShowText}
    >
      {props.children}
    </div>
  );
};
