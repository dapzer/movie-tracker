import styles from './ui-spoiler-text.module.scss';
import { ReactNode, useState } from 'react';

interface UiSpoilerTextProps {
  children: ReactNode;
}

export const UiSpoilerText = (props: UiSpoilerTextProps) => {
  const [isShowText, setIsShowText] = useState<boolean>(false);

  const toggleShowText = () => {
    setIsShowText((prev) => !prev);
  };

  return (
    <div className={`${styles['wrapper']} ${!isShowText ? styles['active'] : ''}`} onClick={toggleShowText}>
      {props.children}
    </div>
  );
};
