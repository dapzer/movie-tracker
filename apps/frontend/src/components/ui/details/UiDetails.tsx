import { useEffect, useState } from 'react';
import styles from './ui-details.module.scss';
import { ArrowIcon } from '@/components/ui/Icons';
import { Typography } from '@/components/ui/typography/UiTypography';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  description?: string;
  title: string;
  isOpenedDefault?: boolean;
  isLarge?: boolean;
  additionalOpenHandler?: () => void;
}

export const UiDetails = (props: Props) => {
  const { children, title, isOpenedDefault, description, isLarge, additionalOpenHandler } = props;
  const [isOpen, setIsOpen] = useState(isOpenedDefault ? isOpenedDefault : false);

  useEffect(() => {
    setIsOpen(Boolean(isOpenedDefault));
  }, [isOpenedDefault]);

  return (
    <div>
      <button
        className={clsx(styles['toggle_btn'], {
          [styles['large']]: isLarge,
        })}
        onClick={(e) => {
          setIsOpen((prevState) => !prevState);
          additionalOpenHandler?.();
        }}
      >
        <div className={styles['info']}>
          <Typography className={styles['title']}>{title}</Typography>
          {description && <Typography className={styles['description']}>{description}</Typography>}
        </div>
        <div
          className={clsx(styles['arrow'], {
            [styles['arrow_active']]: isOpen,
          })}
        >
          <ArrowIcon />
        </div>
      </button>
      <div className={styles['content']} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};