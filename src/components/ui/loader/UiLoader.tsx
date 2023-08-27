import styles from './ui-loader.module.scss';
import { CSSProperties } from 'react';

interface UiLoaderProps {
  size?: number;
  thickness?: number;
}

export const UiLoader = ({ size, thickness }: UiLoaderProps) => {
  return (
    <div
      className={styles['body']}
      style={
        {
          '--loader-size': size && `${size}px`,
          '--loader-thickness': thickness && `${thickness}px`,
        } as CSSProperties
      }
    ></div>
  );
};
