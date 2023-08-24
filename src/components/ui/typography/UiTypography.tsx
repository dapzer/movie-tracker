import styles from './ui-typography.module.scss';
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { createPolymorphicComponent } from '@/utils/createPolymorphicComponent';

interface TypographyProps {
  className?: string;
  variant?: 'text' | 'title' | 'title2' | 'title3' | 'link' | 'linkUnderlined' | 'textSmall' | 'listItem';
}

export const _Typography = forwardRef<
  React.ElementType,
  TypographyProps & {
    as: React.ElementType;
  }
>((props, ref) => {
  const { as: Component = 'p', variant = 'text', className, ...rest } = props;

  return (
    <Component
      ref={ref}
      className={clsx({
        [styles.text]: variant === 'text',
        [styles.title]: variant === 'title',
        [styles.title2]: variant === 'title2',
        [styles.title3]: variant === 'title3',
        [styles.textSmall]: variant === 'textSmall',
        [styles.link]: variant === 'link',
        [styles.linkUnderlined]: variant === 'linkUnderlined',
        [styles.listItem]: variant === 'listItem',
        [className as string]: className,
      })}
      {...rest}
    />
  );
});

_Typography.displayName = 'Typography';

export const Typography = createPolymorphicComponent<'p', TypographyProps>(_Typography);
